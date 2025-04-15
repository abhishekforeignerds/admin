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
        Schema::table('user', function (Blueprint $table) {
            $table->decimal('winning_percentage', 5, 2)->nullable()->after('points'); // replace 'some_column' with actual column to place after
            $table->decimal('override_chance', 5, 2)->nullable()->after('winning_percentage');
        });
    }

    public function down(): void
    {
        Schema::table('user', function (Blueprint $table) {
            $table->dropColumn(['winning_percentage', 'override_chance']);
        });
    }
};
