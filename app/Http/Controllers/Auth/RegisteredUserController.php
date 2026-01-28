<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Debugging: Log the request data to verify inputs
        Log::info('Register Request Data:', $request->all());
        Log::info('Has File profile_url: ' . ($request->hasFile('profile_url') ? 'Yes' : 'No'));

        // Uncomment this line if you want to stop execution and see the data on screen
        // dd($request->all()); 

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'phone_number' => 'nullable|string|max:20',
            'profile_url' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        try {
            $profileUrl = null;
            if ($request->hasFile('profile_url')) {
                $path = $request->file('profile_url')->store('avatars', 'do');
                
                // Manual URL construction fallback if disk url is missing
                $url = config('filesystems.disks.do.url');
                if ($url) {
                    $profileUrl = rtrim($url, '/') . '/' . ltrim($path, '/');
                } else {
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $filesystem */
                    $filesystem = Storage::disk('do');
                    $profileUrl = $filesystem->url($path);
                }
            }


            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone_number' => $request->input('phone_number'),
                'profile_url' => $profileUrl,
            ]);

            event(new Registered($user));

            Auth::login($user);

            return redirect(route('dashboard', absolute: false));
        } catch (\Exception $e) {
            Log::error('Registration Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
