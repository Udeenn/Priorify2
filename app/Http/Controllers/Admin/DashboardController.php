<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NotificationLog;
use App\Models\Task;
use App\Models\User;
use App\Models\FonnteSetting;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // ── Statistik Utama ──────────────────────────────────────────
        $totalUsers     = User::where('role', '!=', 'admin')->count();
        $totalTasks     = Task::count();
        $completedTasks = Task::completed()->count();
        $overdueTasks   = Task::overdue()->count();
        $fonnteToken = FonnteSetting::getValue('fonnte_token');

        $completionRate = $totalTasks > 0
            ? round(($completedTasks / $totalTasks) * 100, 1)
            : 0;

        // ── Distribusi Quadrant (Eisenhower Matrix) ──────────────────
        // Mendukung format lama (q1-q4) dan format baru (do_first/schedule/delegate/delete)
        $quadrantData = Task::select('quadrant', DB::raw('count(*) as total'))
            ->whereNotNull('quadrant')
            ->whereIn('quadrant', ['do_first', 'schedule', 'delegate', 'delete', 'q1', 'q2', 'q3', 'q4'])
            ->groupBy('quadrant')
            ->pluck('total', 'quadrant')
            ->toArray();

        // ── Distribusi Status ────────────────────────────────────────
        $statusData = Task::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        // ── Task per Mata Kuliah (Top 8) ─────────────────────────────
        $taskPerMatkul = Task::select('mata_kuliah', DB::raw('count(*) as total'))
            ->groupBy('mata_kuliah')
            ->orderByDesc('total')
            ->limit(8)
            ->get()
            ->map(fn($t) => ['name' => $t->mata_kuliah, 'value' => $t->total]);

        // ── Tren Task 7 Hari Terakhir ────────────────────────────────
        $taskTrend = Task::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('count(*) as total')
        )
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->keyBy('date');

        $trendLabels = [];
        $trendValues = [];
        for ($i = 6; $i >= 0; $i--) {
            $date          = now()->subDays($i)->toDateString();
            $trendLabels[] = now()->subDays($i)->format('d M');
            $trendValues[] = $taskTrend[$date]->total ?? 0;
        }

        // ── Rata-rata Progress per Mata Kuliah ───────────────────────
        $avgProgressMatkul = Task::select(
            'mata_kuliah',
            DB::raw('round(avg(progress), 1) as avg_progress'),
            DB::raw('count(*) as total')
        )
            ->groupBy('mata_kuliah')
            ->orderByDesc('avg_progress')
            ->limit(6)
            ->get();

        // ── Notifikasi (7 hari terakhir) ─────────────────────────────
        $notifStats = NotificationLog::select('status', DB::raw('count(*) as total'))
            ->where('sent_at', '>=', now()->subDays(7))
            ->groupBy('status')
            ->pluck('total', 'status')
            ->toArray();

        $totalNotifs = array_sum($notifStats);

        // ── User Terbaru (5) ─────────────────────────────────────────
        $recentUsers = User::where('role', '!=', 'admin')
            ->withCount('tasks')
            ->latest()
            ->limit(5)
            ->get(['id', 'name', 'email', 'whatsapp_number', 'created_at']);

        // ── Task Akan Overdue (3 hari ke depan) ──────────────────────
        $upcomingDeadlines = Task::with('user:id,name')
            ->where('deadline', '>', now())
            ->where('deadline', '<=', now()->addDays(3))
            ->where('status', '!=', 'selesai')
            ->orderBy('deadline')
            ->limit(10)
            ->get(['id', 'user_id', 'nama_tugas', 'mata_kuliah', 'deadline', 'progress', 'quadrant']);

        // ── Top User Teraktif ─────────────────────────────────────────
        $topUsers = User::where('role', '!=', 'admin')
            ->withCount([
                'tasks',
                'tasks as completed_tasks_count' => fn($q) => $q->where('status', 'selesai'),
            ])
            ->orderByDesc('tasks_count')
            ->limit(5)
            ->get(['id', 'name', 'email']);

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalUsers'     => $totalUsers,
                'totalTasks'     => $totalTasks,
                'completedTasks' => $completedTasks,
                'overdueTasks'   => $overdueTasks,
                'completionRate' => $completionRate,
                'totalNotifs'    => $totalNotifs,
            ],
            'quadrantData'      => $quadrantData,
            'statusData'        => $statusData,
            'taskPerMatkul'     => $taskPerMatkul,
            'trend'             => [
                'labels' => $trendLabels,
                'values' => $trendValues,
            ],
            'avgProgressMatkul' => $avgProgressMatkul,
            'notifStats'        => $notifStats,
            'recentUsers'       => $recentUsers,
            'upcomingDeadlines' => $upcomingDeadlines,
            'topUsers'          => $topUsers,
            'fonnteToken' => $fonnteToken,
        ]);
    }
}
