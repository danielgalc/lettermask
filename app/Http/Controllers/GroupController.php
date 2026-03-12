<?php

namespace App\Http\Controllers;

use App\Models\Edition;
use App\Models\Group;
use App\Models\Participation;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function store(Request $request, Edition $edition)
    {
        $this->authorize('create', [Group::class, $edition]);

        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
        ]);

        $group = Group::create([
            'edition_id' => $edition->id,
            'name'       => $validated['name'] ?? null,
        ]);

        Participation::create([
            'user_id'   => auth()->id(),
            'group_id'  => $group->id,
            'is_leader' => true,
        ]);

        return back()->with('success', 'Grupo creado correctamente.');
    }

    public function update(Request $request, Group $group)
    {
        $this->authorize('update', $group);

        $validated = $request->validate([
            'name'         => 'nullable|string|max:255',
            'costume_name' => 'nullable|string|max:255',
        ]);

        $group->update($validated);

        return back()->with('success', 'Grupo actualizado correctamente.');
    }

    public function destroy(Group $group)
    {
        $this->authorize('adminOverride', Group::class);

        $group->delete();

        return back()->with('success', 'Grupo eliminado correctamente.');
    }

    public function ready(Group $group)
    {
        $participation = $group->participations()
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $participation->update(['individual_ready' => true]);

        if ($group->allMembersReady()) {
            $group->update(['reveal_status' => 'ready']);
        }

        return back()->with('success', '¡Listo! Esperando al resto del grupo.');
    }

    public function reveal(Group $group)
    {
        $this->authorize('adminOverride', Group::class);

        $group->update(['reveal_status' => 'revealed']);

        return back()->with('success', 'Disfraz revelado.');
    }
}