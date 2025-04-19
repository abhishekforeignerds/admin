<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;

use App\Models\User;
use App\Models\Plant;
use App\Models\Fund;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class StockitController extends Controller
{
    public function index(Request $request)
    {    
        $users = User::with(['plant', 'roles'])->role('Stockit')->get();
    
        $activeUsers = User::role('Stockit')->where('status', 'active')->count();
        $allUsers = User::role('Stockit')->where('status', '!=', 'deleted')
        ->count();

        $pendingUsers = User::role('Stockit')->where('status', 'pending_approval')->count();
        $inactiveUsers = User::role('Stockit')->where('status', 'inactive')->count();
    
        return Inertia::render('Users/Stockit/View', [
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
        return Inertia::render('Users/Stockit/Create', [
            'roles' => $roles,
            'rolespermissions' => $rolespermissions,
            'plants' => $plants,
            'subAdmins'     => User::role('Super Admin')->get(['id','name']),
            'stockitUsers'  => User::role('Stockit')->get(['id','name']),
        ]);
    }



    public function store(Request $request)
    {
        // 1) Validation
        $validated = $request->validate([
            'name'            => 'required|string|max:255',
            'email'           => ['required','string','email:dns','max:255','unique:users'],
            'password'        => 'required|string|min:8',
            'role'            => ['required','string'],
            'mobile_number'   => [
                'required','string','size:10','regex:/^[0-9]{10}$/',
                Rule::unique('users','mobile_number'),
            ],
            'status'          => 'required|string',
            'company_name'    => 'nullable|string',
            'gstin_number'    => 'nullable|string',
            'pan_card'        => 'nullable|string',
            'state_code'      => 'nullable|string',
            'plant_id'        => ['nullable','integer','exists:plants,id'],
            'company_address' => 'nullable|string',
            // New field: how much to seed/transfer
            'pan_card'          => [
                Rule::requiredIf(in_array($request->role, ['Super Admin','Stockit','Retailer'])),
                'numeric','min:1'
            ],
            // If Stockit, require the sub_admin_id
            'sub_admin_id'    => [
                Rule::requiredIf($request->role === 'Stockit'),
                'nullable','integer','exists:users,id'
            ],
            // If Retailer, require the stockit_id
            'stockit_id'      => [
                Rule::requiredIf($request->role === 'Retailer'),
                'nullable','integer','exists:users,id'
            ],
        ]);

        try {
            DB::transaction(function() use ($validated) {
                // 2) Create user with zero balance
                $user = User::create([
                    'name'            => $validated['name'],
                    'email'           => $validated['email'],
                    'password'        => bcrypt($validated['password']),
                    'mobile_number'   => $validated['mobile_number'],
                    'status'          => $validated['status'],
                    'company_name'    => $validated['company_name']   ?? null,
                    'gstin_number'    => $validated['gstin_number']   ?? null,
                    'pan_card'        => 0,    // start at zero
                    'state_code'      => $validated['state_code']     ?? null,
                    'plant_assigned'  => $validated['plant_id']       ?? null,
                    'company_address' => $validated['company_address']?? null,
                    'sub_admin_id' => $validated['sub_admin_id']?? null,
                ]);

                // Assign role
                $user->syncRoles($validated['role']);
                $amount = $validated['pan_card'];

                // 3a) Sub Admin creation: funds come from the lone Super Admin
                if ($validated['role'] === 'Super Admin') {
                    $super = User::role('Super Admin')->sole();
                    if ($super->pan_card < $amount) {
                        throw new \Exception('Low Balance');
                    }
                    $user->increment('pan_card', $amount);
                    $super->decrement('pan_card', $amount);
                }

                // 3b) Stockit creation: funds come from selected Sub Admin
                if ($validated['role'] === 'Stockit') {
                    $sub = User::findOrFail($validated['sub_admin_id']);
                    if ($sub->pan_card < $amount) {
                        throw new \Exception('Low Balance');
                    }
                    $user->increment('pan_card', $amount);
                    $sub->decrement('pan_card', $amount);
                }

                // 3c) Retailer creation: funds come from selected Stockit
                if ($validated['role'] === 'Retailer') {
                    $stk = User::findOrFail($validated['stockit_id']);
                    if ($stk->pan_card < $amount) {
                        throw new \Exception('Low Balance');
                    }
                    $user->increment('pan_card', $amount);
                    $stk->decrement('pan_card', $amount);
                }
            });
        } catch (\Exception $e) {
            // Rollback has already occurred; show message
            return redirect()
                ->route('users.index')
                ->with('success', $e->getMessage());
        }

    

        return redirect()
            ->route('users.index')
            ->with('success', 'User created successfully.');
    }
}
