<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\FinancialJournal;
use App\Models\Order;
use App\Models\UserCourse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;

class WebhookController extends Controller
{
    public function handleStripe(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        switch ($event->type) {
            case 'payment_intent.succeeded':
                $paymentIntent = $event->data->object;
                $this->handlePaymentSucceeded($paymentIntent);
                break;
            case 'payment_intent.payment_failed':
                $paymentIntent = $event->data->object;
                $this->handlePaymentFailed($paymentIntent);
                break;
        }

        return response()->json(['status' => 'success']);
    }

    protected function handlePaymentSucceeded($paymentIntent)
    {
        $order = Order::where('payment_id', $paymentIntent->id)->first();

        if ($order && $order->status !== 'paid') {
            $order->update(['status' => 'paid']);

            foreach ($order->items as $item) {
                UserCourse::firstOrCreate([
                    'user_id' => $order->user_id,
                    'course_id' => $item->course_id
                ], [
                    'price_paid' => $item->price
                ]);
            }

            // Clear Cart
            Cart::where('user_id', $order->user_id)->delete();

            // Log Journal
            FinancialJournal::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => 'income',
                'amount' => $order->total_amount,
                'status' => 'success',
                'description' => 'Payment received for Order ' . $order->order_number,
                'metadata' => ['stripe_payment_intent' => $paymentIntent->id]
            ]);

            Log::info("Order {$order->order_number} paid successfully.");
        }
    }

    protected function handlePaymentFailed($paymentIntent)
    {
        $order = Order::where('payment_id', $paymentIntent->id)->first();

        if ($order) {
            $order->update(['status' => 'failed']);

            FinancialJournal::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'type' => 'failed_payment',
                'amount' => $order->total_amount,
                'status' => 'failed',
                'description' => 'Payment failed for Order ' . $order->order_number,
                'metadata' => ['stripe_payment_intent' => $paymentIntent->id]
            ]);
        }
    }
}
