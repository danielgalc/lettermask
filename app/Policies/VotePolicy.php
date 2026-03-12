<?php

namespace App\Policies;

use App\Models\Vote;
use App\Models\User;
use App\Models\Group;
use App\Models\Category;

class VotePolicy
{
    public function create(User $user, Category $category, Group $group): bool
    {
        if ($category->edition->status !== 'voting_open') {
            return false;
        }

        $ownGroup = $user->participations()
            ->where('group_id', $group->id)
            ->exists();

        if ($ownGroup) {
            return false;
        }

        $alreadyVoted = Vote::where('user_id', $user->id)
            ->where('category_id', $category->id)
            ->exists();

        return !$alreadyVoted;
    }
}