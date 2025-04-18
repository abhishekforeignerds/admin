<?php

namespace App\Http\Controllers;

use App\Models\GameResults;
use App\Models\Notification;
use App\Models\Users;
use App\Models\User;
use App\Models\Plant;
use App\Models\Fund;
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
        'first_name'          => 'required|string|max:255',
        'last_name'           => 'required|string|max:255',
        'country'             => 'required|string|max:100',
        'phone'               => [
            'required',
            'string',
            'max:15',
            'regex:/^[0-9]{7,15}$/',
            Rule::unique('user', 'phone'),
        ],
        'email'               => 'required|string|email|max:255|unique:user',
        'username'            => [
            'required',
            'string',
            'max:100',
            Rule::unique('user', 'username'),
        ],
        'password'            => 'required|string|min:8',
        'points'              => 'required|integer|min:0',
        'winning_percentage'  => 'required|numeric|min:0|max:100',
        'override_chance'     => 'required|numeric|min:0|max:100',
    ]);

    $user = Users::create([
        'first_name'          => $request->first_name,
        'last_name'           => $request->last_name,
        'country'             => $request->country,
        'phone'               => $request->phone,
        'email'               => $request->email,
        'username'            => $request->username,
        'password'            => bcrypt($request->password),
        'points'              => $request->points,
        'winning_percentage'  => $request->winning_percentage,
        'override_chance'     => $request->override_chance,
    ]);

    // Optionally, if you no longer assign a role, remove this line.
    // $user->assignRole($request->role);

    Notification::create([
        'from_id'           => auth()->id(),
        'to_id'             => User::whereHas('roles', fn($q) => $q->where('name', 'Super Admin'))->value('id') ?? 1,
        'type'              => 'created',
        'purpose'           => 'client_created',
        'status'            => 'unread',
        'notification_text' => 'New Client Added successfully.',
        'notification_url'  => 'clients',
    ]);

    return redirect()->route('players.index')->with('success', 'Client created successfully.');
}

    public function edit($id)
    {
        $user = Users::findOrFail($id);
        $roles = Role::all();
        $plants =  Plant::where('status', 'active')->get();
        // echo '<pre>';
        // print_r($user);die;
    
        return Inertia::render('Players/Edit', ['client' => $user, 'roles' => $roles, 'plants' => $plants]);
    }
    public function addfund($id)
    {
        $user = Users::findOrFail($id);
        $roles = Role::all();
        $plants =  Plant::where('status', 'active')->get();
        // echo '<pre>';
        // print_r($user);die;
    
        return Inertia::render('Players/AddFund', ['client' => $user, 'roles' => $roles, 'plants' => $plants]);
    }
    public function storefund(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:user,id',
            'amount' => 'required|numeric|min:0',
            'reference_number' => 'required|string|unique:funds,reference_number',
            'modeOfPayment' => 'required',
        ]);

        $fund = Fund::create([
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'reference_number' => $request->reference_number,
        ]);
        $user = Users::findOrFail($id);
        $user->update([
            'points' => $user->points + $request->amount,
        ]);
       // Redirect to a valid Inertia route with a flash message.
       return redirect()->route('players.index')
       ->with('success', 'Fund entry created successfully.');
    }
      public function view($id)
    {
   
        $gameResults = GameResults::with(['client', 'games'])
        ->where('user_id', $id)
        ->where('bet', '>', 0)
        ->get()
        ->groupBy('game_id');
    
        // echo '<pre>';
        // print_r($user);die;
    
        return Inertia::render('Players/Viewuser', ['gameResults' => $gameResults]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'country' => 'required|string|max:100',
            'phone' => [
                'required',
                'string',
                'max:15',
                'regex:/^[0-9]{7,15}$/',
                Rule::unique('user', 'phone')->ignore($id),
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('user', 'email')->ignore($id),
            ],
            'username' => [
                'required',
                'string',
                'max:100',
                Rule::unique('user', 'username')->ignore($id),
            ],
            'password' => 'nullable|string|min:8',
            'points' => 'required|integer|min:0',
            'winning_percentage' => 'required|numeric|min:0|max:100',
            'override_chance' => 'required|numeric|min:0|max:100',
        ]);
    
        $user = Users::findOrFail($id);
    
        $user->update([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'country' => $request->country,
            'phone' => $request->phone,
            'email' => $request->email,
            'username' => $request->username,
            'password' => $request->password ? bcrypt($request->password) : $user->password,
            'points' => $request->points,
            'winning_percentage' => $request->winning_percentage,
            'override_chance' => $request->override_chance,
        ]);
    
        Notification::create([
            'from_id'           => auth()->id(),
            'to_id'             => User::whereHas('roles', fn($q) => $q->where('name', 'Super Admin'))->value('id') ?? 1,
            'type'              => 'update',
            'purpose'           => 'client_edit',
            'status'            => 'unread',
            'notification_text' => 'Client updated successfully.',
            'notification_url'  => 'clients',
        ]);
    
        return redirect()->route('players.index')->with('success', 'Client updated successfully.');
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
        return redirect()->route('players.index')->with('success', 'Client suspended successfully.');
    }

    
}
