<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\UserDetails;
use Illuminate\Support\Facades\Storage;

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
        $path = NULL;

        try {

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $filename = 'user_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $request->file('photo')->storeAs('photo', $filename, 'public');

            }

            UserDetails::create([
                'name' => $request->name,
                'photo' => $path,
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $path = NULL;
        $user = UserDetails::findOrFail($id);
        try {

            if ($request->hasFile('photo')) {
                if ($user->photo) {
                    $oldPath = str_replace('storage/', 'public/', $user->photo);
                    if (Storage::exists($oldPath)) {
                        Storage::delete($oldPath);
                    }
                }

                $file = $request->file('photo');
                $filename = 'user_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $request->file('photo')->storeAs('photo', $filename, 'public');

            }

            UserDetails::where('id', $id)->update([
                'name' => $request->name,
                'photo' => $path,
                'email' => $request->email,
                'phone' => $request->phone,
                'address' => $request->address,
            ]);

            return response('User successfully updated.', 200)
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
