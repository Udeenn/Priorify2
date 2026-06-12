<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\SubTask;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index()
    {
        $tasks = Task::where('user_id', auth()->id())
            ->with('subtasks')
            ->orderBy('deadline')
            ->get();

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
        ]);
    }

    public function complete(Task $task)
    {
        $task->update([
            'status' => 'selesai',
            'progress' => 100,
        ]);

        return back();
    }

    public function create()
    {
        return Inertia::render('Tasks/Create', [
            'mataKuliah' => [],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_tugas'      => 'required|string|max:255',
            'mata_kuliah'     => 'required|string|max:100',
            'deadline'        => 'required|date|after_or_equal:today',
            'deskripsi'       => 'nullable|string|max:1000',
            'urgensi'         => 'required|integer|min:1|max:5',
            'kepentingan'     => 'required|integer|min:1|max:5',
            'kerumitan'       => 'required|integer|min:1|max:5',
            'reminders'       => 'nullable|array',
            'reminders.*'     => 'string',
            'subtasks'        => 'nullable|array',
            'subtasks.*.nama' => 'nullable|string|max:255',
        ]);

        $task = Task::create([
            'user_id'     => auth()->id(),
            'nama_tugas'  => $validated['nama_tugas'],
            'mata_kuliah' => $validated['mata_kuliah'],
            'deadline'    => $validated['deadline'],
            'deskripsi'   => $validated['deskripsi'] ?? null,
            'urgensi'     => $validated['urgensi'],
            'kepentingan' => $validated['kepentingan'],
            'kerumitan'   => $validated['kerumitan'],
            'quadrant'    => $this->calculateQuadrant($validated['urgensi'], $validated['kepentingan']),
            'reminders'   => json_encode($validated['reminders'] ?? []),
            'status'      => 'pending',
            'progress'    => 0,
        ]);

        if (!empty($validated['subtasks'])) {
            foreach ($validated['subtasks'] as $index => $sub) {
                if (!empty($sub['nama'])) {
                    SubTask::create([
                        'task_id' => $task->id,
                        'nama'    => $sub['nama'],
                        'selesai' => false,
                        'urutan'  => $index,
                    ]);
                }
            }
        }

        return redirect()->route('dashboard');
    }

    public function show(Task $task)
    {
        return Inertia::render('Tasks/Show', [
            'task' => $task->load('subtasks'),
        ]);
    }

    public function edit(Task $task)
    {
        return Inertia::render('Tasks/Edit', [
            'task'       => $task->load('subtasks'),
            'mataKuliah' => [],
        ]);
    }


    public function update(Request $request, Task $task)
    {

        $validated = $request->validate([
            'nama_tugas'      => 'required|string|max:255',
            'mata_kuliah'     => 'required|string|max:100',
            'deadline'        => 'required|date',
            'deskripsi'       => 'nullable|string|max:1000',
            'urgensi'         => 'required|integer|min:1|max:5',
            'kepentingan'     => 'required|integer|min:1|max:5',
            'kerumitan'       => 'required|integer|min:1|max:5',
            'reminders'       => 'nullable|array',
            'subtasks'        => 'nullable|array',
            'subtasks.*.nama' => 'nullable|string|max:255',
            'status'   => 'nullable|string',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $task->update([
            'nama_tugas'  => $validated['nama_tugas'],
            'mata_kuliah' => $validated['mata_kuliah'],
            'deadline'    => $validated['deadline'],
            'deskripsi'   => $validated['deskripsi'] ?? null,
            'urgensi'     => $validated['urgensi'],
            'kepentingan' => $validated['kepentingan'],
            'kerumitan'   => $validated['kerumitan'],
            'quadrant'    => $this->calculateQuadrant($validated['urgensi'], $validated['kepentingan']),
            'reminders'   => json_encode($validated['reminders'] ?? []),
            'status'   => $validated['status'] ?? $task->status,
            'progress' => $validated['progress'] ?? $task->progress,
        ]);

        $task->subtasks()->delete();
        if (!empty($validated['subtasks'])) {
            foreach ($validated['subtasks'] as $index => $sub) {
                if (!empty($sub['nama'])) {
                    SubTask::create([
                        'task_id' => $task->id,
                        'nama'    => $sub['nama'],
                        'selesai' => false,
                        'urutan'  => $index,
                    ]);
                }
            }
        }

        return redirect()->route('tasks.show', $task);
    }

    public function destroy(Task $task)
    {
        $task->delete();

        return redirect()->route('tasks.index');
    }


    public function toggleSubtask(Request $request, Task $task, SubTask $subtask)
    {
        $subtask->update([
            'selesai' => !$subtask->selesai
        ]);

        $task->refresh();

        $total = $task->subtasks()->count();
        $done = $task->subtasks()
            ->where('selesai', true)
            ->count();

        $progress = $total > 0
            ? round(($done / $total) * 100)
            : 0;

        $status = $progress >= 100
            ? 'selesai'
            : 'pending';

        $task->update([
            'progress' => $progress,
            'status' => $status,
        ]);

        // dd([
        //     'progress' => $progress,
        //     'status' => $status,
        //     'task_after_update' => $task->fresh(),
        // ]);
    }

    private function calculateQuadrant(int $urgensi, int $kepentingan): string
    {
        $urgent    = $urgensi >= 3;
        $important = $kepentingan >= 3;

        if ($urgent && $important)  return 'do_first';
        if (!$urgent && $important) return 'schedule';
        if ($urgent && !$important) return 'delegate';
        return 'delete';
    }
}
