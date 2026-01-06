<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class UpdateColumnCreateAndUpdateTime extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('user_posts', function(Blueprint $table){
            $table->unsignedBigInteger('create_time')->change();
            $table->unsignedBigInteger('update_time')->change();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('user_posts', function(Blueprint $table){
            $table->timestamp('create_time')->nullable()->change();
            $table->timestamp('update_time')->nullable()->change();
        });
    }
}
