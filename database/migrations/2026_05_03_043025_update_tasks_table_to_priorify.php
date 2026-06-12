<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Rename kolom yang sudah ada
            $table->renameColumn('title', 'nama_tugas');
            $table->renameColumn('course_name', 'mata_kuliah');
            $table->renameColumn('description', 'deskripsi');
            $table->renameColumn('is_urgent', 'urgensi');
            $table->renameColumn('is_important', 'kepentingan');
            $table->renameColumn('complexity', 'kerumitan');
        });

        Schema::table('tasks', function (Blueprint $table) {
            // Hapus kolom lama yang tidak dipakai
            $table->dropColumn('priority_score');

            // Tambah kolom baru
            $table->enum('quadrant', ['do_first', 'schedule', 'delegate', 'delete'])
                  ->default('schedule')
                  ->after('kerumitan');
            $table->json('reminders')->nullable()->after('quadrant');
            $table->unsignedTinyInteger('progress')->default(0)->after('reminders');
        });

        // Ubah tipe kolom urgensi, kepentingan, kerumitan jadi integer (1-5)
        // karena sebelumnya mungkin boolean
        Schema::table('tasks', function (Blueprint $table) {
            $table->unsignedTinyInteger('urgensi')->default(3)->change();
            $table->unsignedTinyInteger('kepentingan')->default(3)->change();
            $table->unsignedTinyInteger('kerumitan')->default(3)->change();
        });

        // Ubah kolom status jadi enum yang sesuai
        Schema::table('tasks', function (Blueprint $table) {
            $table->enum('status', ['pending', 'in_progress', 'selesai', 'terlambat'])
                  ->default('pending')
                  ->change();
        });
    }

    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->renameColumn('nama_tugas', 'title');
            $table->renameColumn('mata_kuliah', 'course_name');
            $table->renameColumn('deskripsi', 'description');
            $table->renameColumn('urgensi', 'is_urgent');
            $table->renameColumn('kepentingan', 'is_important');
            $table->renameColumn('kerumitan', 'complexity');
            $table->dropColumn(['quadrant', 'reminders', 'progress']);
            $table->integer('priority_score')->nullable();
        });
    }
};