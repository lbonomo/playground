<?php

namespace App\Filament\Resources\PointOfInterests;

use App\Filament\Resources\PointOfInterests\Pages\CreatePointOfInterest;
use App\Filament\Resources\PointOfInterests\Pages\EditPointOfInterest;
use App\Filament\Resources\PointOfInterests\Pages\ListPointOfInterests;
use App\Filament\Resources\PointOfInterests\Schemas\PointOfInterestForm;
use App\Filament\Resources\PointOfInterests\Tables\PointOfInterestsTable;
use App\Models\PointOfInterest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class PointOfInterestResource extends Resource
{
    protected static ?string $model = PointOfInterest::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'name';

    public static function form(Schema $schema): Schema
    {
        return PointOfInterestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return PointOfInterestsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListPointOfInterests::route('/'),
            'create' => CreatePointOfInterest::route('/create'),
            'edit' => EditPointOfInterest::route('/{record}/edit'),
        ];
    }
}
