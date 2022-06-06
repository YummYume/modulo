<?php

namespace App\Service\Utility;

final class ChartJsHelper
{
    public static function fillDatesBetween(
        \DateTimeImmutable|\DateTime $since,
        \DateTimeImmutable|\DateTime $to,
        \DateInterval $interval = new \DateInterval('P1D'),
        array $excludeDates = [],
        mixed $yAxisValue = 0,
        string $xAxisIndex = 'x',
        string $yAxisIndex = 'y'
    ): array {
        $dates = [];
        $period = new \DatePeriod($since, $interval, $to);

        foreach ($period as $date) {
            if (!\in_array($date->format('Y-m-d'), $excludeDates, true)) {
                $dates[] = [
                    $xAxisIndex => $date->format('Y-m-d'),
                    $yAxisIndex => $yAxisValue,
                ];
            }
        }

        return $dates;
    }
}
