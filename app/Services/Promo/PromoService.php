<?php

namespace App\Services\Promo;

use App\Repositories\Promo\PromoRepository;
use Exception;
use Illuminate\Support\Facades\DB;

class PromoService
{
    protected $promoRepository;

    public function __construct(PromoRepository $promoRepository)
    {
        $this->promoRepository = $promoRepository;
    }

    public function getAllPromos(int $perPage = 10)
    {
        return $this->promoRepository->getAllPaginated($perPage);
    }

    public function createPromo(array $data)
    {
        return $this->promoRepository->create($data);
    }

    public function updatePromo(string $id, array $data)
    {
        return $this->promoRepository->update($id, $data);
    }

    public function deletePromo(string $id)
    {
        return $this->promoRepository->delete($id);
    }
}
