<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Promo;
use App\Models\FinancialJournal;
use App\Services\Payment\StripeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    protected $stripeService;

    public function __construct(StripeService $stripeService)
    {
        $this->stripeService = $stripeService;
    }

    public function index()
    {
        $cart = Cart::where('user_id', Auth::id())->with('items.course.courseImages')->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('cart.index');
        }

        $subtotal = $cart->items->sum(function($item) {
            return $item->course->discount_price ?? $item->course->price;
        });

        return Inertia::render('Checkout/Index', [
            'cartItems' => $cart->items,
            'subtotal' => $subtotal,
            'stripeKey' => config('services.stripe.key')
        ]);
    }

    public function success()
    {
        return Inertia::render('Checkout/Success');
    }

    public function validatePromo(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        
        $promo = Promo::where('code', $request->code)->first();

        if (!$promo) {
            return response()->json(['valid' => false, 'message' => 'Invalid promo code'], 422);
        }

        return response()->json([
            'valid' => true,
            'promo' => $promo,
            'message' => 'Promo code applied!'
        ]);
    }

    public function createPaymentIntent(Request $request)
    {
        $user = Auth::user();
        $cart = Cart::where('user_id', $user->id)->with('items.course')->first();
        
        if (!$cart || $cart->items->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 400);
        }

        // Calculate total
        $total = $cart->items->sum(function($item) {
            return $item->course->discount_price ?? $item->course->price;
        });

        // Apply discount if promo present
        $promoId = $request->input('promo_id');
        $discountAmount = 0;
        
        if ($promoId) {
            $promo = Promo::find($promoId);
            if ($promo) {
                if ($promo->type === 'fixed') {
                    $discountAmount = $promo->value;
                } elseif ($promo->type === 'percentage') {
                    $discountAmount = $total * ($promo->value / 100);
                }
            }
        }

        $finalAmount = max(0, $total - $discountAmount);
        $amountInCents = $finalAmount * 100;

        // Check if there is an existing PENDING order for this cart session (optional, but good for avoiding duplicate orders)
        // For simplicity, we will create a new order but reuse the intent if passed? 
        // Better approach: If frontend sends an existing order_id or payment_intent_id, update it.
        // But for now, let's assume we create a new order or update the last pending one.
        
        // Let's check if there is a pending order for this user created recently (e.g. within 1 hour) that matches the amount?
        // Actually, the issue is that when applying promo, we re-call this endpoint.
        // We should check if we already returned a clientSecret for this session?
        // But the amount changed! So we MUST update the intent.

        $existingOrderId = $request->input('order_id');
        $order = null;

        if ($existingOrderId) {
            $order = Order::where('id', $existingOrderId)->where('user_id', $user->id)->where('status', 'pending')->first();
        }

        if ($order) {
            // Update existing order
            $order->update([
                'total_amount' => $finalAmount,
                'discount_amount' => $discountAmount,
                'promo_id' => $promoId,
            ]);

            // Update Payment Intent
            try {
                if ($order->payment_id) {
                    $this->stripeService->updatePaymentIntent($order->payment_id, $amountInCents, [
                        'order_id' => $order->id,
                        'user_id' => $user->id
                    ]);
                    
                    // We don't need to return a new client secret if it's the same intent ID usually, 
                    // but the client secret doesn't change for the same intent.
                    return response()->json([
                        'clientSecret' => null, // Frontend should keep using the old one or we can return it if stored
                        'orderId' => $order->id,
                        'message' => 'Order updated'
                    ]);
                }
            } catch (\Exception $e) {
                // If update fails (e.g. intent invalid), fallback to create new one
            }
        }

        // If no existing order or update failed, create new one
        if (!$order) {
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'total_amount' => $finalAmount,
                'discount_amount' => $discountAmount,
                'status' => 'pending',
                'promo_id' => $promoId,
            ]);

            foreach ($cart->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $item->course_id,
                    'price' => $item->course->discount_price ?? $item->course->price
                ]);
            }
            
            FinancialJournal::create([
                'user_id' => $user->id,
                'order_id' => $order->id,
                'type' => 'payment_initiated',
                'amount' => $finalAmount,
                'status' => 'pending',
                'description' => 'Payment initiated for Order ' . $order->order_number,
                'metadata' => ['payment_provider' => 'stripe']
            ]);
        }

        // Create Stripe Intent
        try {
            $intent = $this->stripeService->createPaymentIntent($amountInCents, 'idr', [
                'order_id' => $order->id,
                'user_id' => $user->id
            ]);

            $order->update(['payment_id' => $intent->id]);

            return response()->json([
                'clientSecret' => $intent->client_secret,
                'orderId' => $order->id
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
