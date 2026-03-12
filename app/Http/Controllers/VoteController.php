<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Edition;
use App\Models\Group;
use App\Models\Vote;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'group_id'    => 'required|exists:groups,id',
        ]);

        $category = Category::findOrFail($validated['category_id']);
        $group    = Group::findOrFail($validated['group_id']);

        $this->authorize('create', [Vote::class, $category, $group]);

        Vote::create([
            'user_id'     => auth()->id(),
            'category_id' => $category->id,
            'group_id'    => $group->id,
        ]);

        return back()->with('success', 'Voto registrado correctamente.');
    }

    public function results(Edition $edition)
    {
        $this->authorize('view', $edition);

        if ($edition->status !== 'closed') {
            abort(403, 'Los resultados aún no están disponibles.');
        }

        $results = $edition->categories()->with(['votes.group'])->get()
            ->map(function ($category) {
                $winner = $category->votes
                    ->groupBy('group_id')
                    ->map->count()
                    ->sortDesc()
                    ->first();

                $winnerGroup = $category->votes
                    ->groupBy('group_id')
                    ->sortByDesc->count()
                    ->keys()
                    ->first();

                return [
                    'category'     => $category->name,
                    'winner_group' => Group::find($winnerGroup),
                    'vote_count'   => $winner,
                ];
            });

        return Inertia::render('Editions/Results', [
            'edition' => $edition,
            'results' => $results,
        ]);
    }
}