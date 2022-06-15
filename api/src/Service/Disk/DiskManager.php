<?php

namespace App\Service\Disk;

final class DiskManager
{
    public const FIND_BEST_UNIT = 'FIND_BEST_UNIT';
    public const TB = 'TB';
    public const GB = 'GB';
    public const MB = 'MB';
    public const KB = 'KB';
    public const TB_SIZE = 1024 * 1024 * 1024 * 1024;
    public const GB_SIZE = 1024 * 1024 * 1024;
    public const MB_SIZE = 1024 * 1024;
    public const KB_SIZE = 1024;

    public function getDiskTotalSpace(string $unit = self::FIND_BEST_UNIT): array
    {
        if (self::FIND_BEST_UNIT === $unit) {
            return $this->getIdealUnitWithSize(disk_total_space('/'));
        }

        return ['size' => $this->convertBytes(disk_total_space('/'), $unit), 'unit' => $unit];
    }

    public function getDiskFreeSpace(string $unit = self::FIND_BEST_UNIT): array
    {
        if (self::FIND_BEST_UNIT === $unit) {
            return $this->getIdealUnitWithSize(disk_free_space('/'));
        }

        return ['size' => $this->convertBytes(disk_free_space('/'), $unit), 'unit' => $unit];
    }

    public function getDiskUsedSpace(string $unit = self::FIND_BEST_UNIT): array
    {
        $bytes = disk_total_space('/') - disk_free_space('/');

        if (self::FIND_BEST_UNIT === $unit) {
            return $this->getIdealUnitWithSize($bytes);
        }

        return ['size' => $this->convertBytes($bytes, $unit), 'unit' => $unit];
    }

    public function getDiskUsedPercentage(): float
    {
        return round(($this->getDiskUsedSpace(self::GB)['size'] / $this->getDiskTotalSpace(self::GB)['size']) * 100, 2);
    }

    public function getPathUsedSpace(string $path, string $unit = self::FIND_BEST_UNIT): array
    {
        if (self::FIND_BEST_UNIT === $unit) {
            return $this->getIdealUnitWithSize($this->getPathSize($path));
        }

        return ['size' => $this->convertBytes($this->getPathSize($path), $unit), 'unit' => $unit];
    }

    public function getPathUsedPercentage(string $path): float
    {
        return round(($this->getPathUsedSpace($path, self::GB)['size'] / $this->getDiskTotalSpace(self::GB)['size']) * 100, 2);
    }

    private function getIdealUnitWithSize(int $bytes): array
    {
        return match (true) {
            self::TB_SIZE <= $bytes => ['size' => $this->convertBytes($bytes, self::TB), 'unit' => self::TB],
            self::GB_SIZE <= $bytes => ['size' => $this->convertBytes($bytes, self::GB), 'unit' => self::GB],
            self::MB_SIZE <= $bytes => ['size' => $this->convertBytes($bytes, self::MB), 'unit' => self::MB],
            self::KB_SIZE <= $bytes => ['size' => $this->convertBytes($bytes, self::KB), 'unit' => self::KB],
            default => ['size' => $this->convertBytes($bytes, self::KB), 'unit' => self::KB],
        };
    }

    private function convertBytes(int $bytes, string $convertTo = self::GB): float
    {
        return round(match ($convertTo) {
            self::TB => $bytes / self::TB_SIZE,
            self::GB => $bytes / self::GB_SIZE,
            self::MB => $bytes / self::MB_SIZE,
            self::KB => $bytes / self::KB_SIZE,
            default => $bytes / self::GB_SIZE,
        }, 2);
    }

    private function getPathSize(string $path): int
    {
        if (!file_exists($path)) {
            return 0;
        }

        if (!is_dir($path)) {
            return filesize($path);
        }

        $size = 0;

        foreach (new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($path)) as $file) {
            $size += $file->getSize();
        }

        return $size;
    }
}
