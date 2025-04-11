<?php

namespace App\Http\Controllers;

use App\Models\Plant;
use App\Models\Game;
use App\Models\RawMaterial;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Imports\FinishedGoodsImport;
use Maatwebsite\Excel\Facades\Excel;
use Carbon\Carbon;
use App\Models\Notification;

use Illuminate\Support\Facades\Storage;

class FinishedGoodController extends Controller
{
    public function index()
    {
        $games = Game::all();




        $allgames = $games->count();
      
        return Inertia::render('Games/View', [
            'games' => $games,
            'statusCounts' => [
                'allgames' => $allgames,
             
            ],
        ]);
    }


    public function create()
    {
        $rawMaterials =  RawMaterial::where('status', 'available')->get();
        return inertia('Games/Create',[
            'rawMaterials' => $rawMaterials,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'material_code' => 'required|string|unique:finished_goods,material_code',
            'material_name' => 'required',
            'hsn_sac_code' => 'required',
        ]);


        $data = $request->all();
        $data['game_spin_time'] = $request->material_code;
        $data['min_bet'] = $request->material_name;
        $data['maximum_bet'] = $request->hsn_sac_code;

        Game::create($data);
       
        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();

        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ?? 1,
            'type'              => 'added',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'New Game added successfully.',
            'notification_url'  => 'finished-goods',
        ]);
        return redirect()
        ->route('finished-goods.index')
        ->with('success', 'New Game added successfully.');

    }

    public function edit($id)
    {
        $finishedGood = FinishedGood::findOrFail($id);
        $rawMaterials =  RawMaterial::where('status', 'available')->get();
        return Inertia::render('FinishedGoods/Edit', [
            'finishedGood' => $finishedGood,
            'rawMaterials' => $rawMaterials,
        ]);
    }

    public function view($id)
    {
        $finishedGood = FinishedGood::findOrFail($id);

        return Inertia::render('FinishedGoods/ViewFinishedGood', [
            'finishedGood' => $finishedGood,
        ]);
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'material_code' => 'required|unique:finished_goods,material_code,' . $id,
            'material_name' => 'required',
            // 'hsn_sac_code' => 'required|unique:finished_goods,hsn_sac_code,' . $id,
            'initial_stock_quantity' => 'required|integer',
            'unit_of_measurement' => 'required|in:pieces',
            'status' => 'required',
            'reorder_level' => 'required',
            // 'buffer_stock' => 'required',
        ]);
        if ($request->initial_stock_quantity == 0) {
            $status = 'unavailable';
        } else if ($request->initial_stock_quantity < $request->reorder_level) {
            $status = 'low_stock';
        } else if ($request->initial_stock_quantity > $request->reorder_level) {
            $status = 'available';
        } 
        $validated['status'] = $status;
      $finishedGood = FinishedGood::findOrFail($id);
   
        $finishedGood->update($validated);

        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();

        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ??  1,
            'type'              => 'updated',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'Finished Good Updated successfully.',
            'notification_url'  => 'finished-goods',
        ]);

        return redirect()->route('finished-goods.index')->with('success', 'Finished Good updated successfully.');
    }

    public function destroy(FinishedGood $finishedGood)
    {
        $finishedGood->delete();
        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();
    
        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ?? 1,
            'type'              => 'deleted',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'Finished Good Deleted successfully.',
            'notification_url'  => 'finished-goods',
        ]);
        return redirect()->route('finished-goods.index')->with('success', 'Finished Good deleted successfully.');
    }

    public function suspend($id) 
    {
        // Find the finished good by ID or fail if not found
        $finishedGood = FinishedGood::findOrFail($id);
    
        // Delete the finished good
        $finishedGood->delete();
        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();
    
        Notification::create([
            'from_id'           => $from_id,
            'to_id'             => $superAdmin->id ?? 1,
            'type'              => 'deleted',
            'purpose'              => 'completed',
            'status'            => 'unread',
            'notification_text' => 'Finished Good Suspended successfully.',
            'notification_url'  => 'finished-goods',
        ]);
    
        // Redirect back with a success message
        return redirect()->route('finished-goods.index')->with('success', 'Finished Good deleted successfully.');
    }
    
    public function importForm()
    {
        return inertia('FinishedGoods/Import');
    }

    // Handle the CSV import
    public function import(Request $request)
    {
        $request->validate([
            'csv_file' => 'required|file|mimes:csv,txt,xlsx,xls|max:2048',
        ]);
        $from_id = auth()->id();
        $superAdmin = User::whereHas('roles', function ($query) {
            $query->where('name', 'Super Admin');
        })->first();
        // Load the file and validate before importing
        try {
            Excel::import(new FinishedGoodsImport, $request->file('csv_file'));

           
            
            Notification::create([
                'from_id'           => $from_id,
                'to_id'             => $superAdmin->id ?? 1,
                'type'              => 'imported',
                'purpose'              => 'completed',
                'status'            => 'unread',
                'notification_text' => 'Finished Good Imported successfully.',
                'notification_url'  => 'finished-goods',
            ]);
        } catch (ValidationException $e) {
            
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        }
    
        return redirect()->route('finished-goods.index')
            ->with('success', 'Finished Goods imported successfully.');
    }
    
}