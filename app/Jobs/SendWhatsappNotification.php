<?php

namespace App\Jobs;

use App\Models\NotificationLog;
use App\Models\Task;
use App\Services\FonnteService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendWhatsappNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        protected Task   $task,
        protected string $messageType, // contoh: "H-3", "H-1", "H-0"
        protected string $message,
    ) {}

    public function handle(FonnteService $fonnte): void
    {
        $user = $this->task->user;

        // Pastikan user punya nomor WA
        if (empty($user->whatsapp_number)) {
            return;
        }

        // Cek apakah notifikasi ini sudah pernah dikirim hari ini
        $sudahKirim = NotificationLog::where('task_id', $this->task->id)
            ->where('message_type', $this->messageType)
            ->whereDate('sent_at', today())
            ->exists();

        if ($sudahKirim) {
            return;
        }

        // Kirim via Fonnte
        $berhasil = $fonnte->send($user->whatsapp_number, $this->message);

        // Simpan log
        NotificationLog::create([
            'task_id'      => $this->task->id,
            'message_type' => $this->messageType,
            'sent_at'      => now(),
            'status'       => $berhasil ? 'sent' : 'failed',
        ]);
    }
}
