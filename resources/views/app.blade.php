<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{ config('app.name', 'Laravel') }} - No More Coins</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.ico') }}" sizes="32x32">
	<link rel="apple-touch-icon" href="{{ asset('favicon.ico') }}">
    <link rel="stylesheet" href="{{ asset('assets/frontend/webfont/tabler-icons.min.css') }}">

    @routes
    @viteReactRefresh
    @unless($page['component'] !== 'welcome')
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    @else
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx", 'resources/css/app.css'])
    @endunless
    @inertiaHead
</head>

<body class="scroll-smooth">
    @inertia


    <script src="{{ asset('assets/frontend/js/bootstrap.bundle.min.js') }}"></script>
	<script src="{{ asset('assets/frontend/js/smooth-scrollbar.js') }}"></script>
    <script src="{{ asset('assets/backend/js/admin.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/main.js') }}"></script>
</body>

</html>
