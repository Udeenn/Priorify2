<?php

namespace App\Console\Commands;

use App\Jobs\SendWhatsappNotification;
use App\Models\Task;
use Illuminate\Console\Command;

class CheckTaskDeadlines extends Command
{
    protected $signature   = 'tasks:check-deadlines';
    protected $description = 'Cek deadline tugas dan kirim notifikasi WhatsApp via Fonnte';

    public function handle(): void
    {
        $this->info('Mengecek deadline tugas...');

        // Ambil semua tugas yang:
        // - belum selesai
        // - punya deadline
        // - punya reminders
        // - punya user dengan nomor WA
        $tasks = Task::with('user')
            ->whereNotIn('status', ['selesai', 'completed'])
            ->whereNotNull('deadline')
            ->whereNotNull('reminders')
            ->whereHas('user', fn($q) => $q->whereNotNull('whatsapp_number'))
            ->get();

        $terkirim = 0;

        foreach ($tasks as $task) {
            $reminders = $this->parseReminders($task->reminders);

            if (empty($reminders)) {
                continue;
            }

            // Hitung selisih hari antara hari ini dan deadline
            $hariMenuju = (int) now()->startOfDay()->diffInDays(
                $task->deadline->startOfDay(),
                false // false = bisa negatif jika sudah lewat
            );

            // Cek apakah hari ini masuk dalam reminder yang dipilih user
            $hariStr = (string) $hariMenuju;

            if (!in_array($hariStr, $reminders)) {
                continue;
            }

            $messageType = "H-{$hariMenuju}";
            $message     = $this->buildMessage($task, $hariMenuju);

            SendWhatsappNotification::dispatchSync($task, $messageType, $message);
            $terkirim++;

            $this->line("  → [{$task->user->name}] {$task->nama_tugas} ({$messageType})");
        }

        $this->info("Selesai. Total notifikasi diproses: {$terkirim}");
    }

    /**
     * Parse kolom reminders dari berbagai format:
     * - JSON string: "[\"3\",\"1\",\"0\"]"
     * - Array PHP sudah di-cast
     */
    private function parseReminders(mixed $reminders): array
    {
        if (is_array($reminders)) {
            return array_map('strval', $reminders);
        }

        if (is_string($reminders)) {
            $decoded = json_decode($reminders, true);
            if (is_array($decoded)) {
                return array_map('strval', $decoded);
            }
        }

        return [];
    }

    private function buildMessage(Task $task, int $hariMenuju): string
    {
        $deadline  = $task->deadline->format('d M Y');
        $nama      = $task->user->name;
        $namaTugas = $task->nama_tugas;
        $matkul    = $task->mata_kuliah;
        $progress  = $task->progress ?? 0;

        if ($hariMenuju === 0) {
            $waktu = "⚠️ *HARI INI* adalah batas pengumpulan!";
        } else {
            $waktu = "📅 Sisa *{$hariMenuju} hari* lagi.";
        }

        return "Halo, *{$nama}*! 👋\n\n" .
            "Pengingat tugas dari *TaskManager*:\n\n" .
            "📚 Mata Kuliah : {$matkul}\n" .
            "📝 Tugas       : {$namaTugas}\n" .
            "🗓️ Deadline    : {$deadline}\n" .
            "📊 Progress    : {$progress}%\n\n" .
            "{$waktu}\n\n" .
            "Segera selesaikan tugasmu ya! 💪";
    }
}
