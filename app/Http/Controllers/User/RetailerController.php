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

class RetailerController extends Controller
{
    public function index(Request $request)
    {    
        $users = User::with(['plant', 'roles'])->role('Retailer')->get();
    
        $activeUsers = User::role('Retailer')->where('status', 'active')->count();
        $allUsers = User::role('Retailer')->where('status', '!=', 'deleted')
        ->count();

        $pendingUsers = User::role('Retailer')->where('status', 'pending_approval')->count();
        $inactiveUsers = User::role('Retailer')->where('status', 'inactive')->count();
    
        return Inertia::render('Users/Retailer/View', [
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
        return Inertia::render('Users/Retailer/Create', [
            'roles' => $roles,
            'rolespermissions' => $rolespermissions,
            'plants' => $plants,
            'subAdmins'     => User::role('Super Admin')->get(['id','name']),
            'stockitUsers'  => User::role('Stockit')->get(),
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
            'company_name'      => 'nullable|string',
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
                    'name'             => $validated['name'],
                    'email'            => $validated['email'],
                    'password'         => bcrypt($validated['password']),
                    'mobile_number'    => $validated['mobile_number'],
                    'status'           => $validated['status'],
                    'company_name'     => $validated['company_name']   ?? null,
                    'gstin_number'     => $validated['gstin_number']   ?? null,
                    'pan_card'         => 0,    // start at zero
                    'state_code'       => $validated['state_code']     ?? null,
                    'plant_assigned'   => $validated['plant_id']       ?? null,
                    'company_address'  => $validated['company_address']?? null,
                    'stockit_id'       => $validated['stockit_id'],
                    'sub_admin_id'     => $validated['sub_admin_id'],
                    'company_name'     => $validated['company_name'],
                ]);
               
                
                // now you can sync roles
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

        // Notify & redirect on success


        return redirect()
            ->route('retailer.index')
            ->with('success', 'User created successfully.');
    }  

    public function storefund(Request $request, $id)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'amount' => 'required|numeric|min:0',
            'reference_number' => 'required|string|unique:funds,reference_number',
            'modeOfPayment' => 'required',
        ]);
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })
        ->first();
        $subAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })
        ->first();
        $stockit = User::whereHas('roles', function ($query) {
            $query->where('name', 'Stockit');
        })
        ->first();
        $fund = Fund::create([
            'user_id' => $request->user_id,
            'amount' => $request->amount,
            'reference_number' => $request->reference_number,
        ]);
        $user = User::findOrFail($id);
        if ($user->roles->contains('name', 'Super Admin')) {
            if ($superAdmin->pan_card - $request->amount < 0) {
                return redirect()->route('users.index')
                ->with('success', 'Low Balance');
            } else {
                $user->update([
                    'pan_card' => $user->pan_card + $request->amount,
                ]);
                $superAdmin->update([
                    'pan_card' => $superAdmin->pan_card - $request->amount,
                ]);
                return redirect()->route('users.index')
                ->with('success', 'Fund Added Successfully');
            }
        }
        if ($user->roles->contains('name', 'Retailer')) {
            if ($stockit->pan_card - $request->amount < 0) {
                return redirect()->route('users.index')
                ->with('success', 'Low Balance');
            } else {
                $user->update([
                    'pan_card' => $user->pan_card + $request->amount,
                ]);
                $stockit->update([
                    'pan_card' => $stockit->pan_card - $request->amount,
                ]);
                return redirect()->route('users.index')
                ->with('success', 'Fund Added Successfully');
            }
        }
        if ($user->roles->contains('name', 'Stockit')) {
            
            if ($subAdmin->pan_card - $request->amount < 0) {
                return redirect()->route('users.index')
                ->with('success', 'Low Balance');
            } else {
                $user->update([
                    'pan_card' => $user->pan_card + $request->amount,
                ]);
                $subAdmin->update([
                    'pan_card' => $subAdmin->pan_card - $request->amount,
                ]);
                return redirect()->route('users.index')
                ->with('success', 'Fund Added Successfully');
            }
            
        }
       
       // Redirect to a valid Inertia route with a flash message.
       
    }
}
