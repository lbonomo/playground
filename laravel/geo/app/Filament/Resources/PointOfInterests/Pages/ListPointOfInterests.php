<?php

namespace App\Filament\Resources\PointOfInterests\Pages;

use App\Filament\Resources\PointOfInterests\PointOfInterestResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListPointOfInterests extends ListRecords
{
    protected static string $resource = PointOfInterestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
