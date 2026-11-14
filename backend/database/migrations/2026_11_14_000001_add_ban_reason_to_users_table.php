<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('users', 'ban_reason')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('ban_reason', 500)->nullable()->after('is_banned');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('users', 'ban_reason')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('ban_reason');
            });
        }
    }
};
