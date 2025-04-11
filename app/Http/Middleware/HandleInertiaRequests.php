<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Notification;

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
        if ($request->user()) {
            $role_name = $request->user()->roles->pluck('name');
        }

        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'      => $request->user()->id,
                    'name'    => $request->user()->name,
                    'email'   => $request->user()->email,
                    'plant_id'=> $request->user()->plant_assigned,
                    'roles'   => $request->user()->roles->pluck('name'),
                    'rolespermissions'    => $request->user()->roles->map(function ($role) {
                        return [
                            'name'        => $role->name,
                            'permissions' => $role->permissions->pluck('name'), // returns a collection of permission names
                        ];
                    }),
                ] : null,
            ],
            'notifications_unread' => [
    'unread_count' => $request->user()
        ? (
            $role_name[0] === 'Super Admin'
            ? Notification::where('status', 'unread')->count()
            : Notification::where('status', 'unread')
                ->where('to_id', $request->user()->id)
                ->count()
        )
        : 0,
],

            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ]);
    }
    
}
