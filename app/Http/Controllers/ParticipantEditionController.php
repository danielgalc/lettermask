<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use Inertia\Inertia;

class ParticipantEditionController extends Controller
{
    public function index()
    {
        $editions = Edition::orderByDesc('event_date')->get();

        return Inertia::render('Editions/Index', [
            'editions' => $editions,
        ]);
    }

    public function show(Edition $edition)
    {
        $edition->load(['groups.participations.user', 'categories']);

        $userGroup = $edition->groups()
            ->whereHas('participations', fn($q) =>
                $q->where('user_id', auth()->id())
            )
            ->with('participations.user')
            ->first();

        return Inertia::render('Editions/Show', [
            'edition'   => $edition,
            'userGroup' => $userGroup,
        ]);
    }
}