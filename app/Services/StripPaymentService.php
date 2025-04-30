<?php

namespace App\Services;

use Stripe\Stripe;
use Stripe\StripeClient;
use App\Models\Subscription;
use Stripe\Checkout\Session;
use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiErrorException;

class StripPaymentService
{
    protected StripeClient $stripeClient;

    /**
     * @param StripeClient $stripeClient
     */
    public function __construct(StripeClient $stripeClient)
    {
        $this->stripeClient = $stripeClient;
    }

    public function createPaymentIntent($data, $successUrl, $cancelUrl, $title, $amount)
    {
        try {

            Stripe::setApiKey(env('STRIPE_SECRET_KEY'));

            $lineItems[] = [
                'price_data' => [
                    'currency' => 'USD',
                    'product_data' => ['name' => $title],
                    'unit_amount' => ($amount) * 100
                ],
                'quantity' => 1,
            ];

            $session = Session::create([
                'line_items' => $lineItems,
                'mode'        => 'payment',
                'success_url' => $successUrl  . "?session_id={CHECKOUT_SESSION_ID}",
                'cancel_url'  => $cancelUrl
            ]);

            if (isset($session->url)) {
                $data->update(['trx_ref' => $session->id]);
                return response()->json([
                    'status'  =>  true,
                    'redirectUrl'  =>   $session->url,
                ])->getData();
            }

            return response()->json([
                'status'  =>  false,
                'redirectUrl'  =>   NULL
            ])->getData();

        } catch (ApiErrorException $e) {
            $data->failed();
            session()->flash('error', 'Unable to make payment. Please try again later');
            dd($e->getMessage());
            return redirect()->back();

        }
    }

    public function verifyTransaction($sessionId)
    {
        try {

            $response = $this->stripeClient->checkout->sessions->retrieve($sessionId);

            if (isset($response->payment_status) && $response->payment_status === 'paid') {
                return true;
            }

            return false;
        } catch (\Throwable $th) {

            Log::error($th->getMessage());
            // return response()->json([
            //     'status' => false,
            //     'response' => []
            // ])->getData();
            // return API_RESPONSE_HELPER(false, $th->getMessage(), 'Opps! Could not complete transaction.',  [], 500)->getDate();
        }
    }

    public function webhook()
    {
        // This is your Stripe CLI webhook secret for testing your endpoint locally.
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload,
                $sig_header,
                $endpoint_secret
            );
        } catch (\UnexpectedValueException $e) {
            // Invalid payload
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            return response('', 400);
        }
        Log::info(json_encode($event->type));
        // Handle the event
        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;


            // ... handle other event types
            default:
                echo 'Received unknown event type ' . $event->type;
        }

        return response('');
    }
}
