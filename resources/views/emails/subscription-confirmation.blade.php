@component('mail::message')
# Subscription Confirmation

Hello {{ $user->name }},

Thank you for subscribing to our **{{ $plan->name }}** plan! Here are your subscription details:

@component('mail::panel')
**Plan Name:** {{ $plan->name }}  
**Start Date:** {{ $startDate }}  
@if($isLifetime)
**Access:** Lifetime Membership 🎉  
@else
**End Date:** {{ $endDate }}  
**Duration:** {{ $duration }} days  
@endif
@endcomponent

You now have access to:
@foreach($features as $feature)
✓ {{ $feature }}  
@endforeach

@component('mail::button', ['url' => $actionUrl])
Access Your Account
@endcomponent

Need help or have questions? Reply to this email or visit our [support center]({{ $supportUrl }}).

Welcome aboard!  
The {{ $appName }} Team
@endcomponent
