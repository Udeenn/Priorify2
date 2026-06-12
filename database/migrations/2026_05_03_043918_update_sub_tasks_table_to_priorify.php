<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('sub_tasks', function (Blueprint $table) {
            $table->renameColumn('title', 'nama');
            $table->renameColumn('is_completed', 'selesai');
        });

        Schema::table('sub_tasks', function (Blueprint $table) {
            $table->unsignedSmallInteger('urutan')->default(0)->after('selesai');
        });
    }

    public function down(): void
    {
        Schema::table('sub_tasks', function (Blueprint $table) {
            $table->renameColumn('nama', 'title');
            $table->renameColumn('selesai', 'is_completed');
            $table->dropColumn('urutan');
        });
    }
};