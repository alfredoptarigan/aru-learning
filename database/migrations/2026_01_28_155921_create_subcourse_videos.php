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
        Schema::create('subcourse_videos', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('sub_course_id')->constrained('sub_courses')->onDelete('cascade');
            $table->string("title");
            $table->string("video_url");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subcourse_videos');
    }
};
