<?php

namespace App\Livewire;

use App\Models\PointOfInterest;
use Illuminate\Database\Eloquent\Collection;
use Livewire\Component;

class HomePage extends Component
{
    public $latitude = -34.603722;
    public $longitude = -58.381592;
    public $zoom = 13;
    public $points = [];

    public function mount()
    {
        $this->updatePoints();
    }

    public function updateMapCenter($lat, $lng, $zoom)
    {
        $this->latitude = $lat;
        $this->longitude = $lng;
        $this->zoom = $zoom;

        $this->updatePoints();
    }

    public function updatePoints()
    {
        // Simple "nearest" logic: Get all points and sort by distance in PHP for simplicity in this prototype.
        // For production with many points, utilize database spatial functions (ST_Distance_Sphere).

        $allPoints = PointOfInterest::all();

        $this->points = $allPoints->map(function ($point) {
            $point->distance = $this->calculateDistance(
                $this->latitude,
                $this->longitude,
                $point->latitude,
                $point->longitude
            );
            return $point;
        })->sortBy('distance')->take(20)->values()->toArray();
    }

    private function calculateDistance($lat1, $lon1, $lat2, $lon2)
    {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper('K'); // Kilometers

        if ($unit == "K") {
            return ($miles * 1.609344);
        } else if ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }

    public function render()
    {
        return view('livewire.home-page');
    }
}
