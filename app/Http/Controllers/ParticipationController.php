<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Participation;
use App\Models\User;
use Illuminate\Http\Request;

class ParticipationController extends Controller
{
    public function store(Request $request, Group $group)
    {
        $this->authorize('invite', $group);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $alreadyInGroup = Participation::whereHas('group', fn($q) =>
            $q->where('edition_id', $group->edition_id)
        )->where('user_id', $validated['user_id'])->exists();

        if ($alreadyInGroup) {
            return back()->withErrors(['user_id' => 'Este usuario ya pertenece a un grupo en esta edición.']);
        }

        if ($group->isComplete()) {
            return back()->withErrors(['group' => 'El grupo ya está completo.']);
        }

        Participation::create([
            'user_id'  => $validated['user_id'],
            'group_id' => $group->id,
        ]);

        return back()->with('success', 'Participante añadido correctamente.');
    }

    public function destroy(Participation $participation)
    {
        $group = $participation->group;
        $this->authorize('update', $group);

        $participation->delete();

        return back()->with('success', 'Participante eliminado del grupo.');
    }
}