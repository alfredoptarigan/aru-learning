<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    private function getCart()
    {
        if (Auth::check()) {
            return Cart::firstOrCreate(['user_id' => Auth::id()]);
        }
        // Basic guest cart logic could go here (using session_id)
        return null;
    }

    public function index()
    {
        $cart = $this->getCart();
        $items = [];
        
        if ($cart) {
            $items = $cart->items()->with(['course.courseImages'])->get();
        }

        return Inertia::render('Cart/Index', [
            'cartItems' => $items
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $cart = $this->getCart();
        
        if (!$cart) {
            return redirect()->route('login');
        }

        // Check if already in cart
        if ($cart->items()->where('course_id', $request->course_id)->exists()) {
            return back()->with('info', 'Course is already in your cart.');
        }

        // Check if already owned (optional, good UX)
        // ...

        $cart->items()->create([
            'course_id' => $request->course_id
        ]);

        return back()->with('success', 'Course added to cart!');
    }

    public function remove(Request $request, $itemId)
    {
        $cart = $this->getCart();
        
        if ($cart) {
            $cart->items()->where('id', $itemId)->delete();
        }

        return back()->with('success', 'Item removed from cart.');
    }
}
