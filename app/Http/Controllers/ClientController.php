<?php

namespace App\Http\Controllers;

use App\Models\GameResults;
use App\Models\Notification;
use App\Models\Users;
use App\Models\Plant;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    public function index(Request $request)
    {
    
        $users = Users::all();

        return Inertia::render('Players/View', ['users' => $users,
        ]);
    }

    public function create()
    {
        $roles = Role::all();
        $plants =  Plant::where('status', 'active')->get();
        return Inertia::render('Players/Create', ['roles' => $roles, 'plants' => $plants]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string',
           'mobile_number' =>  [
                'nullable',
                'string',
                'size:10', // Ensures exactly 10 digits
                'regex:/^[0-9]{10}$/', // Ensures only numeric values
                Rule::unique('users', 'mobile_number'),
            ],
            'status' => 'required',
            'company_name' => 'nullable|string',
            'gstin_number' => 'nullable|string',
            'pan_card' => 'nullable|string',
            'state_code' => 'nullable',
             'plant_id' => 'nullable|string',
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

        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();
    
        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ?? 1,
            'type'              => 'created',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'New Client Added successfully.',
            'notification_url'  => 'finished-goods',
        ]);

        return redirect()->route('clients.index')->with('success', 'Client created successfully.');
    }

    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();
        $plants =  Plant::where('status', 'active')->get();
        // echo '<pre>';
        // print_r($user);die;
    
        return Inertia::render('Players/Edit', ['client' => $user, 'roles' => $roles, 'plants' => $plants]);
    }
      public function view($id)
    {
   
        $gameResults = GameResults::with(['client', 'games'])->where('user_id', $id)->get()->groupBy('game_id');
        // echo '<pre>';
        // print_r($user);die;
    
        return Inertia::render('Players/Viewuser', ['gameResults' => $gameResults]);
    }

   public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'mobile_number' => [
            'nullable',
            'string',
            'size:10',
            'regex:/^[0-9]{10}$/',
            Rule::unique('users', 'mobile_number')->ignore($id), // Ignore the current user's mobile number
        ],
            'status' => 'required',
            'company_name' => 'required|string',
            'gstin_number' => 'required|string',
            'pan_card' => 'required|string',
            'plant_assigned' => 'required|string',
            'state_code' => 'required|string',
            'company_address' => 'required|string',
        ]);

        $user = User::findOrFail($id);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
            'mobile_number' => $request->mobile_number,
            'status' => $request->status,
            'company_name' => $request->company_name,
            'gstin_number' => $request->gstin_number,
            'pan_card' => $request->pan_card,
            'state_code' => $request->state_code,
            'plant_assigned' => $request->plant_assigned,
            'company_address' => $request->company_address,
        ]);

        $user->syncRoles($request->role);

        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();
    
        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ?? 1,
            'type'              => 'created',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'Client updated successfully.',
            'notification_url'  => 'finished-goods',
        ]);

        return redirect()->route('clients.index')->with('success', 'Client updated successfully.');
    }
    public function suspend($id)
    {
        // Find the user by ID or fail if not found
        $user = User::findOrFail($id);

        // Update the user's status to 'inactive'
        $user->update([
            'status' => 'inactive',
        ]);

        // Redirect back with a success message
        return redirect()->route('clients.index')->with('success', 'Client suspended successfully.');
    }
}
