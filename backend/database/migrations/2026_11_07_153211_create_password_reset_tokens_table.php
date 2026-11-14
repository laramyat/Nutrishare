
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Create table only if it does not already exist
        if (!Schema::hasTable('password_reset_tokens')) {

            Schema::create('password_reset_tokens', function (Blueprint $table) {
                $table->string('email')->primary();
                $table->string('token');
                $table->timestamp('created_at')->nullable();
            });

        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop table only if it exists
        Schema::dropIfExists('password_reset_tokens');
    }
};
