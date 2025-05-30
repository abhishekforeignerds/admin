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
        Schema::table('plants', function (Blueprint $table) {
            $table->longText('raw_materials')->nullable();
        });
    }

    public function down()
    {
        Schema::table('plants', function (Blueprint $table) {
            $table->dropColumn('raw_materials');
        });
    }
};
