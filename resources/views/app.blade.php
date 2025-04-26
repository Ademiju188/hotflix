<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <link rel="stylesheet" href="{{ asset('assets/frontend/webfont/tabler-icons.min.css') }}">
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx", 'resources/css/app.css'])
    @inertiaHead
</head>

<body>
    @inertia


    <script src="{{ asset('assets/frontend/js/bootstrap.bundle.min.js') }}"></script>
    {{-- <script src="{{ asset('assets/frontend/js/splide.min.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/slimselect.min.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/smooth-scrollbar.js') }}"></script> --}}
    {{-- <script src="{{ asset('assets/frontend/js/plyr.min.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/photoswipe.min.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/photoswipe-ui-default.min.js') }}"></script> --}}
    {{-- <!-- <script src="{{ asset('assets/backend/js/slimselect.min.js') }}"></script> --> --}}
	{{-- <!-- <script src="{{ asset('assets/backend/js/smooth-scrollbar.js') }}"></script> --> --}}
    <script src="{{ asset('assets/backend/js/admin.js') }}"></script>
    <script src="{{ asset('assets/frontend/js/main.js') }}"></script>

</body>

</html>
