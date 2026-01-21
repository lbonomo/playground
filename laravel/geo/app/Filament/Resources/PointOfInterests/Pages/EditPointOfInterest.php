<?php

namespace App\Filament\Resources\PointOfInterests\Pages;

use App\Filament\Resources\PointOfInterests\PointOfInterestResource;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditPointOfInterest extends EditRecord
{
    protected static string $resource = PointOfInterestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }
}
