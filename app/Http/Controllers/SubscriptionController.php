<?php

namespace App\Http\Controllers;

use DB;
use App\Models\Plan;
use Inertia\Inertia;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Services\StripPaymentService;
use App\Mail\SubscriptionConfirmationMail;

class SubscriptionController extends Controller
{
    protected ?StripPaymentService $stripPaymentService;

    public function __construct(StripPaymentService $stripPaymentService)
    {
        $this->stripPaymentService = $stripPaymentService;
    }

    public function checkout(Plan $plan)
    {
        return DB::transaction(function () use ($plan) {
            $payment = $this->processPayment($plan);

            $successUrl = route('process-checkout', [], true);
            $cancelUrl = route('pricing', [], true);
            $title = "{$plan->planType->name} Plan";

            $stripPaymentService = $this->stripPaymentService->createPaymentIntent(
                $payment,
                $successUrl,
                $cancelUrl,
                $title,
                $plan->price
            );

            if (isset($stripPaymentService->status) && $stripPaymentService->status === true) {
                if (isset($stripPaymentService->status) && $stripPaymentService->status === true) {
                    return Inertia::location($stripPaymentService->redirectUrl);
                }
            }

            session()->flash('error', 'Unable to make payment. Please try again later');
            return redirect()->back();
        });
    }

    protected function processPayment($plan)
    {
        return $plan->payments()->create([
            'amount' => $plan->price,
        ]);
    }

    public function verify(Request $request)
    {
        if (!isset($request->session_id)) {
            return redirect()->route('pricing');
        }

        $payment = Payment::where('trx_ref', $request->session_id)->first();

        // Check if payment already exists and was completed
        if ($payment && $payment->status === 'completed') {
            session()->flash('info', 'Payment was already processed');
            return redirect()->to(user()->dashboard());
        }

        $response = $this->stripPaymentService->verifyTransaction($request->session_id);

        if ($response && $payment) {
            // Check if subscription already exists for this payment
            if ($payment->subscriptions()->exists()) {
                session()->flash('info', 'Subscription already created');
                return redirect()->to(user()->dashboard());
            }

            $subscriptionDates = calculateSubscriptionDates($payment->plan->planType->duration_days);
            $subscription = null;
            // Use transaction to ensure atomic operation
            DB::transaction(function () use ($payment, $subscriptionDates, &$subscription) {
                $subscription = $payment->subscriptions()->create([
                    'trx_ref' => $payment->trx_ref,
                    'plan_id' => $payment->plan_id,
                    'start_date' => $subscriptionDates['start_date'],
                    'end_date' => $subscriptionDates['end_date'],
                    'is_lifetime' => $subscriptionDates['is_lifetime'],
                    'status' => 'active',
                ]);

                $payment->completed();
            });

            // Send confirmation email
            if ($subscription) {
                Mail::to(user()->email)->send(
                    new SubscriptionConfirmationMail($subscription)
                );
            }

            session()->flash('success', 'Payment was successful');
            return redirect()->to(user()->dashboard());
        }

        session()->flash('error', 'Payment Cancelled');
        return redirect()->route('pricing');
    }

    public function webhook()
    {
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
            return response('', 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response('', 400);
        }

        switch ($event->type) {
            case 'checkout.session.completed':
                $session = $event->data->object;
                $payment = Payment::where('trx_ref', $session->id)->first();

                if ($payment && $payment->status !== 'completed') {
                    $subscription = null;
                    DB::transaction(function () use ($payment, &$subscription) {
                        // Check if subscription already exists
                        if ($payment->subscriptions()->exists()) {
                            return;
                        }

                        $subscriptionDates = calculateSubscriptionDates($payment->plan->planType->duration_days);

                        $subscription = $payment->subscriptions()->create([
                            'trx_ref' => $payment->trx_ref,
                            'plan_id' => $payment->plan_id,
                            'start_date' => $subscriptionDates['start_date'],
                            'end_date' => $subscriptionDates['end_date'],
                            'is_lifetime' => $subscriptionDates['is_lifetime'],
                            'status' => 'active',
                        ]);

                        $payment->completed();
                    });

                    if ($subscription) {
                        Mail::to(user()->email)->send(
                            new SubscriptionConfirmationMail($subscription)
                        );
                    }
                }
                break;

            default:
                Log::info('Received unhandled event type: ' . $event->type);
        }

        return response('');
    }
}
