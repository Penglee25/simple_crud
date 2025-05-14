<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\UserDetails;

class UserDetailsController extends Controller
{

    public function fetch()
    {
        return UserDetails::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {

            UserDetails::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return response('User successfully created.', 200)
                ->header('Content-Type', 'text/plain');

        } catch (\Throwable $e) {
            Log::error('Store Error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred.',
                'error' => $e->getMessage(),
            ], 500);
        }


    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        if (!$id) {
            abort(403);
        }

        UserDetails::find($id)->delete();

        return response('User successfully deleted.', 200)
            ->header('Content-Type', 'text/plain');
    }
}
