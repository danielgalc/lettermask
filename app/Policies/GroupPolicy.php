<?php

namespace App\Policies;

use App\Models\Group;
use App\Models\User;
use App\Models\Edition;

class GroupPolicy
{
    public function create(User $user, Edition $edition): bool
    {
        if ($edition->status !== 'groups_forming') {
            return false;
        }

        $alreadyInGroup = $user->participations()
            ->whereHas('group', fn($q) => $q->where('edition_id', $edition->id))
            ->exists();

        return !$alreadyInGroup;
    }

    public function update(User $user, Group $group): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $group->participations()
            ->where('user_id', $user->id)
            ->where('is_leader', true)
            ->exists();
    }

    public function invite(User $user, Group $group): bool
    {
        if ($group->edition->status !== 'groups_forming') {
            return false;
        }

        return $group->participations()
            ->where('user_id', $user->id)
            ->where('is_leader', true)
            ->exists();
    }

    public function adminOverride(User $user): bool
    {
        return $user->isAdmin();
    }
}