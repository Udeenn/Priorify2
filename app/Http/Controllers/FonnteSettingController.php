<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\FonnteSetting;

class FonnteSettingController extends Controller
{
    public function updateFonnte(Request $request)
    {
        $request->validate([
            'fonnte_token' => ['required', 'string'],
        ]);

        FonnteSetting::updateOrCreate(
            ['key' => 'fonnte_token'],
            ['value' => $request->fonnte_token]
        );

        return back()->with(
            'success',
            'Token Fonnte berhasil diperbarui'
        );
    }
}
