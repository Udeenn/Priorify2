<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'mata_kuliah',
        'nama_tugas',
        'deskripsi',
        'deadline',
        'kepentingan',
        'urgensi',
        'kerumitan',
        'quadrant',
        'reminders',
        'progress',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'deadline'  => 'datetime',
            'reminders' => 'array',
            'progress'  => 'integer',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subTasks(): HasMany
    {
        return $this->hasMany(SubTask::class);
    }

    public function notificationLogs(): HasMany
    {
        return $this->hasMany(NotificationLog::class);
    }

    // Scope helpers — mendukung 'selesai' (student) maupun 'completed'
    public function scopeCompleted($query)
    {
        return $query->whereIn('status', ['completed', 'selesai']);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeOverdue($query)
    {
        return $query
            ->whereDate('deadline', '<', now())
            ->where('status', '!=', 'selesai');
    }
}
