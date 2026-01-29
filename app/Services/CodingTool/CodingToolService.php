<?php

namespace App\Services\CodingTool;

use App\Interfaces\CodingTool\CodingToolRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

class CodingToolService
{
    /**
     * Create a new class instance.
     */
    protected $codingToolRepository;
    public function __construct(CodingToolRepositoryInterface $codingToolRepository)
    {
        $this->codingToolRepository = $codingToolRepository;
    }

    public function getPaginated(int $perPage = 10)
    {
        return $this->codingToolRepository->getAll($perPage);
    }

    public function create(array $data, ?UploadedFile $image = null)
    {
        try {
            DB::beginTransaction();

            if ($image) {
                $path = $image->store('coding-tools', 'do');
                $data['image'] = Storage::disk('do')->url($path);
            }

            $codingTool = $this->codingToolRepository->create($data);
            DB::commit();
            return $codingTool;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function update(string $id, array $data)
    {
        try {
            DB::beginTransaction();
            $codingTool = $this->codingToolRepository->update($id, $data);
            DB::commit();
            return $codingTool;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    public function getAll(int $perPage = 10)
    {
        return $this->codingToolRepository->getAll($perPage);
    }
}
