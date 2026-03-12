<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Edition;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Index', [
            'stats' => [
                'total_editions'  => Edition::count(),
                'active_editions' => Edition::whereNotIn('status', ['draft', 'closed'])->count(),
                'total_users'     => User::count(),
            ],
        ]);
    }
}