<?php

namespace App\Filament\Forms\Components;

use Filament\Forms\Components\Field;

class MapPicker extends Field
{
    protected string $view = 'filament.forms.components.map-picker';

    protected string $latitudeField = 'latitude';
    protected string $longitudeField = 'longitude';

    public function latitudeField(string $field): static
    {
        $this->latitudeField = $field;
        return $this;
    }

    public function longitudeField(string $field): static
    {
        $this->longitudeField = $field;
        return $this;
    }

    public function getLatitudeField(): string
    {
        return $this->latitudeField;
    }

    public function getLongitudeField(): string
    {
        return $this->longitudeField;
    }
}
