<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubTask extends Model
{
    use HasFactory;

    protected $fillable = [
        'task_id',
        'nama',
        'selesai',
        'urutan',
    ];

    protected function casts(): array
    {
        return [
            'selesai' => 'boolean',
            'urutan'  => 'integer',
        ];
    }

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }
}
