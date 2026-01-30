<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user() ? $request->user()->getAllPermissions()->pluck('name') : [],
                'roles' => $request->user() ? $request->user()->getRoleNames() : [],
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'cartCount' => $request->user() ? \App\Models\Cart::where('user_id', $request->user()->id)->first()?->items()->count() ?? 0 : 0,
            'cartPreview' => $request->user() 
                ? \App\Models\Cart::where('user_id', $request->user()->id)
                    ->with(['items.course' => function($q) {
                        $q->select('id', 'title', 'price', 'discount_price')->with('courseImages');
                    }])
                    ->first()
                    ?->items
                    ->take(5) 
                : [],
        ];
    }
}
