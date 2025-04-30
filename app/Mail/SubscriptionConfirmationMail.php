<?php

namespace App\Mail;

use App\Models\Subscription;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Contracts\Queue\ShouldQueue;

class SubscriptionConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    private $subscription;

    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }

    public function envelope(): Envelope
    {
        $appName = config('app.name');
        return new Envelope(
            subject: "Your {$appName} Subscription Confirmation",
        );
    }

    public function content(): Content
    {
        $appName = config('app.name');
        $formattedStart = Carbon::parse($this->subscription->start_date)->format('F j, Y');
        $duration = $this->subscription->is_lifetime ? null : Carbon::parse($this->subscription->start_date)->diffInDays($this->subscription->end_date);
        $formattedEnd = $this->subscription->is_lifetime ? null : Carbon::parse($this->subscription->end_date)->format('F j, Y');

        $features = [
            'Full content library',
            $this->subscription->is_lifetime ? 'Permanent access with no renewals needed' : 'Automatic reminders before renewal',
            'Premium customer support'
        ];

        return new Content(
            markdown: 'emails.subscription-confirmation',
            with: [
                'user' => $this->subscription->user,
                'plan' => $this->subscription->plan,
                'startDate' => $formattedStart,
                'endDate' => $formattedEnd,
                'isLifetime' => $this->subscription->is_lifetime,
                'duration' => $duration,
                'features' => $features,
                'actionUrl' => user()->dashboard(),
                'supportUrl' => '#',
                'appName' => $appName
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
