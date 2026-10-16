<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::all();

        return response()->json($clients);
    }

    public function show(int $id)
    {
        $client = Client::findOrFail($id);

        return response()->json($client);
    }

    public function update(Request $request, int $id)
    {
        $client = Client::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
        ]);

        $client->update($validated);

        return response()->json($client);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
        ]);

        $client = Client::create($validated);

        return response()->json($client, 201);
    }

    public function destroy(int $id)
    {
        $client = Client::findOrFail($id);

        $client->delete();

        return response()->json([
            'message' => 'Client deleted successfully'
        ]);
    }
}