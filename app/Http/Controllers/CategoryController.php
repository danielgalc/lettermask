<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Edition;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(Request $request, Edition $edition)
    {
        $this->authorize('create', Category::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $edition->categories()->create($validated);

        return back()->with('success', 'Categoría creada correctamente.');
    }

    public function update(Request $request, Category $category)
    {
        $this->authorize('update', $category);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $category->update($validated);

        return back()->with('success', 'Categoría actualizada correctamente.');
    }

    public function destroy(Category $category)
    {
        $this->authorize('delete', $category);

        $category->delete();

        return back()->with('success', 'Categoría eliminada correctamente.');
    }
}