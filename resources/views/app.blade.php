<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- SEO Meta Tags -->
        <meta name="description" content="Pixel Edu - Platform Pembelajaran Online untuk Developer">
        <meta name="keywords" content="learning, education, coding, programming, courses, online learning">
        <meta name="author" content="Pixel Edu">

        <!-- Favicon -->
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <link rel="manifest" href="/site.webmanifest">

        <!-- Theme Color -->
        <meta name="theme-color" content="#3B82F6">
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1E293B">

        <!-- Open Graph / Facebook -->
        <meta property="og:type" content="website">
        <meta property="og:url" content="{{ config('app.url') }}">
        <meta property="og:title" content="{{ config('app.name') }} - Platform Pembelajaran Online">
        <meta property="og:description" content="Platform Pembelajaran Online untuk Developer">
        <meta property="og:image" content="{{ config('app.url') }}/logo.svg">

        <!-- Twitter -->
        <meta property="twitter:card" content="summary_large_image">
        <meta property="twitter:url" content="{{ config('app.url') }}">
        <meta property="twitter:title" content="{{ config('app.name') }} - Platform Pembelajaran Online">
        <meta property="twitter:description" content="Platform Pembelajaran Online untuk Developer">
        <meta property="twitter:image" content="{{ config('app.url') }}/logo.svg">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <script>
            // Check local storage for theme preference and apply it immediately to avoid FOUC
            const themeStorage = localStorage.getItem('theme-storage');
            if (themeStorage) {
                try {
                    const theme = JSON.parse(themeStorage).state.theme;
                    if (theme === 'dark') {
                        document.documentElement.classList.add('dark');
                    }
                } catch (e) {
                    console.error('Error parsing theme storage', e);
                }
            }
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
