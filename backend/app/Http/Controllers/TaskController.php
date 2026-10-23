<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::all();

        return response()->json($tasks);
    }

    public function show(int $id)
    {
        $task = Task::findOrFail($id);

        return response()->json($task);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => [
                'required',
                'integer',
                'exists:projects,id',
            ],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => [
                'required',
                Rule::in(['pending', 'in_progress', 'completed']),
            ],
            'due_date' => 'nullable|date',
        ]);

        $task = Task::create($validated);

        return response()->json($task, 201);
    }

    public function update(Request $request, int $id)
    {
        $task = Task::findOrFail($id);

        $validated = $request->validate([
            'project_id' => [
                'required',
                'integer',
                'exists:projects,id',
            ],
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => [
                'required',
                Rule::in(['pending', 'in_progress', 'completed']),
            ],
            'due_date' => 'nullable|date',
        ]);

        $task->update($validated);

        return response()->json($task);
    }

    public function destroy(int $id)
    {
        $task = Task::findOrFail($id);

        $task->delete();

        return response()->json([
            'message' => 'Task deleted successfully',
        ]);
    }
}
