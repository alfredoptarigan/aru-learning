<?php

namespace App\Services\Payment;

use Stripe\Stripe;
use Stripe\PaymentIntent;

class StripeService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPaymentIntent(float $amount, string $currency = 'idr', array $metadata = [])
    {
        return PaymentIntent::create([
            'amount' => (int) $amount,
            'currency' => $currency,
            'metadata' => $metadata,
            'automatic_payment_methods' => [
                'enabled' => true,
            ],
        ]);
    }

    public function updatePaymentIntent(string $paymentIntentId, float $amount, array $metadata = [])
    {
        return PaymentIntent::update($paymentIntentId, [
            'amount' => (int) $amount,
            'metadata' => $metadata,
        ]);
    }
}
