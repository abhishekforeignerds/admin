<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Add nullable foreign‐keys, after whichever column you prefer
            $table->unsignedBigInteger('sub_admin_id')->nullable()->after('plant_assigned');
            $table->unsignedBigInteger('stockit_id')->nullable()->after('sub_admin_id');

            // Set up foreign key constraints
            $table->foreign('sub_admin_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');

            $table->foreign('stockit_id')
                  ->references('id')
                  ->on('users')
                  ->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop constraints first
            $table->dropForeign(['stockit_id']);
            $table->dropForeign(['sub_admin_id']);

            // Then drop the columns
            $table->dropColumn(['stockit_id', 'sub_admin_id']);
        });
    }
};
