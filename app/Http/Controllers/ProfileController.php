<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Task;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form (with history stats).
     */
    public function edit(Request $request): Response
    {
        $userId = $request->user()->id;

        $doneTasks = Task::where('user_id', $userId)
            ->where('status', 'selesai')
            ->get();

        $total     = $doneTasks->count();
        $terlambat = $doneTasks->filter(fn($t) =>
            $t->updated_at && $t->deadline &&
            $t->updated_at->toDateString() > $t->deadline->format('Y-m-d')
        )->count();
        $tepat     = $total - $terlambat;

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail'   => $request->user() instanceof MustVerifyEmail,
            'status'            => session('status'),
            'whatsapp_verified' => !empty($request->user()->whatsapp_number),
            'stats'             => [
                'total_selesai' => $total,
                'tepat_waktu'   => $tepat,
                'terlambat'     => $terlambat,
                'tepat_persen'  => $total > 0 ? round(($tepat / $total) * 100) : 0,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}