<?php

namespace App\Service\Utility;

final class ChartJsHelper
{
    public static function fillDatesBetween(
        \DateTimeImmutable|\DateTime $since,
        \DateTimeImmutable|\DateTime $to,
        \DateInterval $interval = new \DateInterval('P1D'),
        mixed $yAxisValue = 0,
        string $xAxisIndex = 'x',
        string $yAxisIndex = 'y'
    ): array {
        $dates = [];
        $period = new \DatePeriod($since, $interval, $to);

        foreach ($period as $date) {
            $dates[] = [
                $xAxisIndex => $date->format('Y-m-d'),
                $yAxisIndex => $yAxisValue,
            ];
        }

        return $dates;
    }
}
