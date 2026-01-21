<?php

namespace App\Filament\Resources\PointOfInterests\Schemas;

use App\Filament\Forms\Components\MapPicker;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PointOfInterestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
                Textarea::make('description')
                    ->maxLength(65535)
                    ->columnSpanFull(),
                MapPicker::make('location_map')
                    ->label('Location')
                    ->latitudeField('latitude')
                    ->longitudeField('longitude')
                    ->columnSpanFull(),
                TextInput::make('latitude')
                    ->required()
                    ->numeric(),
                TextInput::make('longitude')
                    ->required()
                    ->numeric(),
            ]);
    }
}
