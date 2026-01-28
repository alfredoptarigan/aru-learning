<?php

namespace App\Services\Tier;

use App\Interfaces\Tier\TierRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class TierService
{
    protected $tierRepository;

    public function __construct(TierRepositoryInterface $tierRepository)
    {
        $this->tierRepository = $tierRepository;
    }

    public function createTier(array $data)
    {
        DB::beginTransaction();

        try {
            // Check if tier already exists
            if ($this->tierRepository->findByName($data['name'])) {
                throw new Exception('Tier with this name already exists.');
            }

            // Create tier
            $tier = $this->tierRepository->create($data);

            DB::commit();

            return $tier;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getPaginatedTiers(int $perPage = 10)
    {
        return $this->tierRepository->getPaginated($perPage);
    }
}
