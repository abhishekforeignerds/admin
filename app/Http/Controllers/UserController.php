<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Plant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use App\Models\Notification;


class UserController extends Controller
{
    public function index(Request $request)
    {    
        $users = User::with(['plant', 'roles'])->get();
    
        $activeUsers = User::where('status', 'active')->count();
        $allUsers = User::where('status', '!=', 'deleted')
        ->count();

        $pendingUsers = User::where('status', 'pending_approval')->count();
        $inactiveUsers = User::where('status', 'inactive')->count();
    
        return Inertia::render('Users/View', [
            'users' => $users,
            'statusCounts' => [
                'active' => $activeUsers,
                'pending' => $pendingUsers,
                'inactive' => $inactiveUsers,
                'allUsers' => $allUsers,
            ],
        ]);
    }
    

    public function create()
    {
        $roles = Role::all();
        $rolespermissions = Role::with('permissions')->get();
        $plants =  Plant::where('status', 'active')->get();
        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'rolespermissions' => $rolespermissions,
            'plants' => $plants,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email:dns|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
           'mobile_number' =>  [
                'required',
                'string',
                'size:10', // Ensures exactly 10 digits
                'regex:/^[0-9]{10}$/', // Ensures only numeric values
                Rule::unique('users', 'mobile_number'),
            ],
            'status' => 'required',
            'company_name' => 'nullable|string',
            'gstin_number' => 'nullable|string',
            'pan_card' => 'nullable|string',
            'state_code' => 'nullable|string',
            'plant_id' => 'nullable',
            'company_address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'mobile_number' => $request->mobile_number,
            'status' => $request->status,
            'company_name' => $request->company_name,
            'gstin_number' => $request->gstin_number,
            'pan_card' => $request->pan_card,
            'state_code' => $request->state_code,
            'plant_assigned' => $request->plant_id,
            'company_address' => $request->company_address,
        ]);

        $user->assignRole($request->role);
        $this->sendNotification(
            'New User added successfully',
            route('users.index')
        );
        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }
    public function edit($id)
    {
        
        $user = User::with('roles', 'plant')->findOrFail($id);
        $roles = Role::all();  
        $plants =  Plant::where('status', 'active')->get();  
    
        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'plants' => $plants,
        ]);
    }
    public function view($id)
    {
        
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();  
    
        return Inertia::render('Users/Viewuser', [
            'user' => $user,
            'roles' => $roles,
        ]);
    }
    

    public function update(Request $request, $id)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email:dns|max:255|unique:users,email,' . $id,
        'password' => 'nullable|string|min:8',
        'role' => 'required|string',
        'mobile_number' => [
            'required',
            'string',
            'size:10',
            'regex:/^[0-9]{10}$/',
            Rule::unique('users', 'mobile_number')->ignore($id), // Ignore the current user's mobile number
        ],
        'status' => 'required',
        'company_name' => 'nullable|string',
        'gstin_number' => 'nullable|string',
        'pan_card' => 'nullable|string',
        'state_code' => 'nullable|string',
        'plant_assigned' => 'nullable',
        'company_address' => 'nullable|string',
    ]);

    $user = User::findOrFail($id);

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
        'password' => $request->password ? bcrypt($request->password) : $user->password,
        'mobile_number' => $request->mobile_number,
        'status' => $request->status,
    ]);

    $user->syncRoles($request->role);

    $this->sendNotification(
        'User updated successfully',
        route('users.index')
    );
    return redirect()->route('users.index')->with('success', 'User updated successfully.');
}

    public function suspend($id)
    {
        // Find the user by ID or fail if not found
        $user = User::findOrFail($id);

        // Update the user's status to 'inactive'
        $user->update([
            'status' => 'deleted',
        ]);
$this->sendNotification(
            'User suspended successfully',
            route('users.index')
        );
        // Redirect back with a success message
        return redirect()->route('users.index')->with('success', 'User suspended successfully.');
    }

/**
     * Send a notification to the Super Admin.
     *
     * @param string $notification_text The notification message.
     * @param string $notification_url  The URL for the notification.
     * @param string $type              The type of the notification (default 'created').
     * @param string $purpose           The purpose of the notification (default 'completed').
     */
    private function sendNotification(
        string $notification_text,
        string $notification_url,
        string $type = 'created',
        string $purpose = 'completed'
    ) {
        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();

        // Check if Super Admin exists before sending notification.
        if ($superAdmin) {
            Notification::create([
                'from_id'           => $from_id,
                'to_id'             => $superAdmin->id ?? 1,
                'type'              => $type,
                'purpose'           => $purpose,
                'status'            => 'unread',
                'notification_text' => $notification_text,
                'notification_url'  => $notification_url,
            ]);
        }
    }

}