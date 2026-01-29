<?php

namespace App\Repositories\Promo;

use App\Interfaces\Promo\PromoRepositoryInterface;
use App\Models\Promo;
use App\Repositories\BaseRepository;

class PromoRepository extends BaseRepository implements PromoRepositoryInterface
{
    public function __construct(Promo $model)
    {
        parent::__construct($model);
    }

    public function getAllPaginated(int $perPage = 10)
    {
        return $this->model->with('course')->latest()->paginate($perPage);
    }

    public function findById(string $id)
    {
        return $this->model->findOrFail($id);
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function update($id, array $data)
    {
        $promo = $this->findById($id);
        $promo->update($data);
        return $promo;
    }

    public function delete($id)
    {
        return $this->model->destroy($id);
    }
}
