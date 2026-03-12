<?php

namespace App\Policies;

use App\Models\Edition;
use App\Models\User;

class EditionPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Edition $edition): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->isAdmin();
    }

    public function update(User $user, Edition $edition): bool
    {
        return $user->isAdmin();
    }

    public function delete(User $user, Edition $edition): bool
    {
        return $user->isAdmin() && $edition->status === 'draft';
    }

    public function transition(User $user, Edition $edition): bool
    {
        return $user->isAdmin();
    }
}