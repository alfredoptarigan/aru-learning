<?php

namespace App\Repositories\Tier;

use App\Interfaces\Tier\TierRepositoryInterface;
use App\Models\Tier;

class TierRepository implements TierRepositoryInterface
{
    public function create(array $data)
    {
        return Tier::create($data);
    }

    public function findByName(string $name)
    {
        return Tier::where('name', $name)->first();
    }

    public function getPaginated(int $perPage = 10)
    {
        return Tier::latest()->paginate($perPage);
    }

    public function update(string $id, array $data){
        $tier = Tier::findOrFail($id);
        $tier->update($data);
        return $tier;
    }

    public function delete(string $id){
        $tier = Tier::findOrFail($id);
        $tier->delete();
        return $tier;
    }

    public function findById(string $id){
        return Tier::findOrFail($id);
    }
}
