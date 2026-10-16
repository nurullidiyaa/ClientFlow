<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::all();

        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:50',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $project = Project::create($validated);

        return response()->json($project, 201);
    }

    public function show(int $id)
    {
        $project = Project::findOrFail($id);

        return response()->json($project);
    }

    public function update(Request $request, int $id)
    {
        $project = Project::findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|max:50',
            'start_date' => 'nullable|date',
            'due_date' => 'nullable|date',
        ]);

        $project->update($validated);

        return response()->json($project);
    }

    public function destroy(int $id)
    {
        $project = Project::findOrFail($id);

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully'
        ]);
    }
}