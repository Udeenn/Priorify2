<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Inertia\Inertia;

class HistoryController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $history = Task::where('user_id', $userId)
            ->where('status', 'selesai')
            ->orderByDesc('updated_at')
            ->get()
            ->map(function ($task) {
                return [
                    'id'           => $task->id,
                    'nama_tugas'   => $task->nama_tugas,
                    'mata_kuliah'  => $task->mata_kuliah,
                    'deadline'     => $task->deadline?->format('Y-m-d'),
                    'quadrant'     => $task->quadrant,
                    'status'       => $task->status,
                    'completed_at' => $task->updated_at?->toDateString(),
                ];
            });

        $total    = $history->count();
        $terlambat = $history->filter(fn($t) =>
            $t['completed_at'] && $t['deadline'] && $t['completed_at'] > $t['deadline']
        )->count();
        $tepat    = $total - $terlambat;

        $stats = [
            'total_selesai' => $total,
            'tepat_waktu'   => $tepat,
            'terlambat'     => $terlambat,
            'tepat_persen'  => $total > 0 ? round(($tepat / $total) * 100) : 0,
        ];

        return Inertia::render('History', [
            'history' => $history,
            'stats'   => $stats,
        ]);
    }
}