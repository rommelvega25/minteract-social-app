<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\AuthController;
use \App\Http\Controllers\Api\PostController;
use \App\Http\Controllers\Api\CommentController;
use \App\Http\Controllers\Api\SearchController;
use \App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function(){
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::get("/user/{id}", [UserController::class, 'index']);

    Route::post("/post/create", [PostController::class, 'store']);
    Route::put("/post/{id}", [PostController::class, 'update']);
    Route::get("/posts/{user_id?}", [PostController::class, 'index']);

    Route::delete('/post/{id}', [PostController::class, 'destroy']);
    Route::post('/post/{id}/like', [PostController::class, 'likePost']);
    Route::delete('/post/like/{id}', [PostController::class, 'deleteLikePost']);

    Route::post('/post/{id}/comment', [CommentController::class, 'store']);
    Route::delete('/comment/{id}', [CommentController::class, 'destroy']);
    Route::post('/comment/{comment_id}/like', [CommentController::class, 'likeComment']);
    Route::delete('/comment/like/{like_id}', [CommentController::class, 'removeLike']);

    Route::post('/comment/{comment_id}/reply', [CommentController::class, 'replyComment']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/user/search', [SearchController::class, 'search']);

    Route::get('/comment/{comment_id}/replies', [CommentController::class, 'getCommentReplies']);
});
Route::post('/login', [AuthController::class, 'login']);
Route::post('/signup', [AuthController::class, 'signup']);
