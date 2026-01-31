# Stochastics

A high-performance Rust tool for generating halftone and stochastic screening effects from images. Optimized for creating patterns suitable for laser engraving, screen printing, and artistic effects.

## Features

- **Halftone Screening**: Classic AM screening with configurable dot shapes.
- **Dot Shapes**: `Euclidean` (default), `Round`, and `Line`.
- **CMYK Color Simulation**: Simulate color halftones with angled screens for RGB channels.
- **Customizable**: Control scale (frequency), angle, brightness, and contrast.
- **High Performance**: Built in Rust with optimized image processing.
- **Configuration**: Support for JSON configuration files and CLI overrides.

## Installation

Ensure you have Rust installed, then build the release binary:

```bash
cargo build --release
```

The executable will be located at `target/release/stochastics`.

## Usage

### Basic Command

```bash
./stochastics -i input.jpg -o output.png --scale 4.0 --angle 45.0
```

### Options

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--input` | `-i` | Input image path | (Required) |
| `--output` | `-o` | Output image path | `output.png` |
| `--scale` | `-s` | Dot scale (inverse frequency). Smaller = finer. | `4.0` |
| `--angle` | `-a` | Screen angle in degrees. | `45.0` |
| `--shape` | `-S` | Dot shape: `euclidean`, `round`, `line`. | `euclidean` |
| `--color` | | Enable simulated color halftone (RGB channels with offset angles). | `false` |
| `--brightness`| `-b` | Brightness offset (-255 to 255). | `0` |
| `--contrast` | `-k` | Contrast factor (1.0 = normal). | `1.0` |
| `--config` | `-c` | Path to JSON config file. | None |

### Configuration File (`config.json`)

You can define defaults in a JSON file:

```json
{
    "scale": 10.0,
    "angle": 15.0,
    "brightness": 30,
    "contrast": 1.2,
    "shape": "euclidean",
    "color": false
}
```

Run with config:
```bash
./stochastics -i input.jpg -o output.png -c config.json
```

CLI arguments always override values in the configuration file.
