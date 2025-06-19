<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Character;
use Illuminate\Support\Facades\Http;

class CharacterController extends Controller
{
    public function fetch()
    {
        $characters = [];
        $page = 1;

        while (count($characters) < 100) {
            $response = Http::get("https://rickandmortyapi.com/api/character?page=$page");

            if (!$response->successful()) {
                return response()->json(['error' => 'Error fetching API'], 500);
            }

            $results = $response->json('results');
            foreach ($results as $char) {
                if (count($characters) >= 100) break;
                $characters[] = $char;
            }

            $page++;
        }

        return response()->json($characters);
    }

    public function store(Request $request)
    {
        foreach ($request->all() as $char) {
            Character::updateOrCreate(
                ['id' => $char['id']],
                [
                    'name' => $char['name'],
                    'status' => $char['status'],
                    'species' => $char['species'],
                    'type' => $char['type'] ?? null,
                    'gender' => $char['gender'] ?? null,
                    'origin_name' => is_array($char['origin']) ? $char['origin']['name'] : null,
                    'origin_url' => is_array($char['origin']) ? $char['origin']['url'] : null,
                    'image' => $char['image'] ?? null
                ]
            );
        }

        return response()->json(['message' => 'Registros guardados correctamente']);
    }


    public function all()
    {
        return response()->json(Character::all());
    }

    public function update(Request $request, $id)
    {
        try {
            $character = Character::findOrFail($id);
            $character->update($request->only([
                'name', 'status', 'species', 'type', 'gender', 'origin_name', 'origin_url', 'image'
            ]));
            return response()->json(['message' => 'Personaje actualizado correctamente']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'No se pudo editar el personaje', 'details' => $e->getMessage()], 400);
        }
    }
}
