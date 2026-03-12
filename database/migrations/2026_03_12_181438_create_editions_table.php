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
        Schema::create('editions', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('theme');
            $table->enum('participation_mode', ['individual', 'pairs', 'groups']);
            $table->unsignedTinyInteger('group_size')->default(1);
            $table->enum('status', [
                'draft',
                'groups_forming',
                'letters_assigned',
                'costumes_revealed',
                'voting_open',
                'closed'
            ])->default('draft');
            $table->boolean('use_letters')->default(false);
            $table->date('event_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editions');
    }
};
