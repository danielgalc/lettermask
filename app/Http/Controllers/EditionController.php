<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EditionController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Edition::class);

        $editions = Edition::orderByDesc('created_at')->get();

        return Inertia::render('Admin/Editions/Index', [
            'editions' => $editions,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Edition::class);

        return Inertia::render('Admin/Editions/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Edition::class);

        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'theme'              => 'required|string|max:255',
            'participation_mode' => 'required|in:individual,pairs,groups',
            'group_size'         => 'required|integer|min:1|max:20',
            'event_date'         => 'nullable|date',
            'use_letters'        => 'boolean',
        ]);

        if ($validated['participation_mode'] !== 'individual') {
            $validated['use_letters'] = false;
        }

        if ($validated['participation_mode'] === 'individual') {
            $validated['group_size'] = 1;
        }

        Edition::create($validated);

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edición creada correctamente.');
    }

    public function show(Edition $edition)
    {
        $this->authorize('view', $edition);

        $edition->load([
            'groups.participations.user',
            'categories',
        ]);

        return Inertia::render('Admin/Editions/Show', [
            'edition' => $edition,
        ]);
    }

    public function edit(Edition $edition)
    {
        $this->authorize('update', $edition);

        return Inertia::render('Admin/Editions/Edit', [
            'edition' => $edition,
        ]);
    }

    public function update(Request $request, Edition $edition)
    {
        $this->authorize('update', $edition);

        $validated = $request->validate([
            'name'               => 'required|string|max:255',
            'theme'              => 'required|string|max:255',
            'participation_mode' => 'required|in:individual,pairs,groups',
            'group_size'         => 'required|integer|min:1|max:20',
            'event_date'         => 'nullable|date',
            'use_letters'        => 'boolean',
        ]);

        if ($validated['participation_mode'] !== 'individual') {
            $validated['use_letters'] = false;
        }

        if ($validated['participation_mode'] === 'individual') {
            $validated['group_size'] = 1;
        }

        $edition->update($validated);

        return redirect()->route('admin.editions.show', $edition)
            ->with('success', 'Edición actualizada correctamente.');
    }

    public function destroy(Edition $edition)
    {
        $this->authorize('delete', $edition);

        $edition->delete();

        return redirect()->route('admin.editions.index')
            ->with('success', 'Edición eliminada correctamente.');
    }

    public function transition(Request $request, Edition $edition)
    {
        $this->authorize('transition', $edition);

        $validated = $request->validate([
            'status' => 'required|in:draft,groups_forming,letters_assigned,costumes_revealed,voting_open,closed',
        ]);

        $newStatus = $validated['status'];

        if ($newStatus === 'letters_assigned' && $edition->usesLetters()) {
            $this->assignLetters($edition);
        }

        $edition->update(['status' => $newStatus]);

        return back()->with('success', 'Estado actualizado correctamente.');
    }

    private function assignLetters(Edition $edition): void
    {
        $letters = range('A', 'Z');
        shuffle($letters);

        $groups = $edition->groups()->get();

        foreach ($groups as $index => $group) {
            $group->update(['letter' => $letters[$index]]);
        }
    }
}