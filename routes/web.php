<?php

use Illuminate\Support\Facades\Route;

Route::get('/Ricky_and_Morty', function () {
    return response()->file(public_path('app/index.html'));
});

Route::get('/', function () {
    return redirect('/Ricky_and_Morty');
});
