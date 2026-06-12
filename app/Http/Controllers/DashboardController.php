<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $tasks = Task::where('user_id', $userId)
            ->orderBy('deadline')
            ->get();

        $stats = [
            'total_tasks'       => $tasks->count(),
            'completed_tasks'   => $tasks->where('status', 'selesai')->count(),
            'pending_tasks'     => $tasks->where('status', 'pending')->count(),
            'upcoming_deadline' => $tasks->where('status', 'pending')
                ->sortBy('deadline')
                ->first()?->nama_tugas ?? 'Tidak ada',
        ];

        $focusTasks = $tasks->where('status', 'pending')
            ->sortBy('deadline')
            ->take(5)
            ->values();

        $matrix = [
            'do_first' => $tasks->where('quadrant', 'do_first')->count(),
            'schedule'  => $tasks->where('quadrant', 'schedule')->count(),
            'delegate'  => $tasks->where('quadrant', 'delegate')->count(),
            'delete'    => $tasks->where('quadrant', 'delete')->count(),
        ];

        // Recent completed tasks for history widget
        $recentHistory = Task::where('user_id', $userId)
            ->where('status', 'selesai')
            ->orderByDesc('updated_at')
            ->take(4)
            ->get()
            ->map(fn($t) => [
                'id'           => $t->id,
                'nama_tugas'   => $t->nama_tugas,
                'mata_kuliah'  => $t->mata_kuliah,
                'deadline'     => $t->deadline?->format('Y-m-d'),
                'completed_at' => $t->updated_at?->toDateString(),
                'status'       => $t->status,
            ]);

        return Inertia::render('Dashboard', [
            'stats'         => $stats,
            'tasks'         => $focusTasks,
            'matrix'        => $matrix,
            'recentHistory' => $recentHistory,
        ]);
        // dd($focusTasks->toArray());
    }
}
