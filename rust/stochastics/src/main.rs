mod processor;
mod config;

use clap::Parser;
use std::path::PathBuf;
use std::fs::File;
use std::io::BufReader;
use config::Config;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Input image file
    #[arg(short, long)]
    input: PathBuf,

    /// Output image file
    #[arg(short, long, default_value = "output.png")]
    output: PathBuf,

    /// Halftone scale (dot size parameter), smaller is finer dots.
    #[arg(short, long)]
    scale: Option<f32>,

    /// Screen angle in degrees.
    #[arg(short, long)]
    angle: Option<f32>,

    /// Brightness offset (-255 to 255).
    #[arg(short, long)]
    brightness: Option<i32>,

    /// Contrast factor (e.g. 1.0 is original, >1.0 increases contrast).
    #[arg(short = 'k', long)]
    contrast: Option<f32>,

    /// Dot shape (euclidean, round, line).
    #[arg(short = 'S', long, value_enum)]
    shape: Option<String>,

    /// Configuration file (JSON)
    #[arg(short, long)]
    config: Option<PathBuf>,
}

fn apply_exif_orientation(img: image::DynamicImage, path: &std::path::Path) -> image::DynamicImage {
    let file = match File::open(path) {
        Ok(f) => f,
        Err(_) => return img,
    };
    let mut reader = BufReader::new(file);
    let exifreader = exif::Reader::new();
    let exif = match exifreader.read_from_container(&mut reader) {
        Ok(exif) => exif,
        Err(_) => return img,
    };

    let orientation = match exif.get_field(exif::Tag::Orientation, exif::In::PRIMARY) {
        Some(field) => match field.value.get_uint(0) {
            Some(v @ 1..=8) => v,
            _ => return img,
        },
        None => return img,
    };

    match orientation {
        2 => img.fliph(),
        3 => img.rotate180(),
        4 => img.flipv(),
        5 => img.rotate90().fliph(),
        6 => img.rotate90(),
        7 => img.rotate270().fliph(),
        8 => img.rotate270(),
        _ => img,
    }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let args = Args::parse();

    // Default values
    let mut final_scale = 4.0;
    let mut final_angle = 45.0;
    let mut final_brightness = 0;
    let mut final_contrast = 1.0;
    let mut final_shape = config::DotShape::Euclidean;

    // Load config if present
    if let Some(config_path) = &args.config {
        let config = Config::load_from_file(config_path)?;
        if let Some(s) = config.scale { final_scale = s; }
        if let Some(a) = config.angle { final_angle = a; }
        if let Some(b) = config.brightness { final_brightness = b; }
        if let Some(c) = config.contrast { final_contrast = c; }
        if let Some(s) = config.shape { final_shape = s; }
    }

    // CLI overrides
    if let Some(s) = args.scale { final_scale = s; }
    if let Some(a) = args.angle { final_angle = a; }
    if let Some(b) = args.brightness { final_brightness = b; }
    if let Some(c) = args.contrast { final_contrast = c; }
    if let Some(s) = args.shape {
        final_shape = match s.to_lowercase().as_str() {
            "line" => config::DotShape::Line,
            "round" => config::DotShape::Round,
            _ => config::DotShape::Euclidean,
        };
    }

    // Load the image
    let mut img = image::open(&args.input)?;

    // Apply EXIF orientation
    img = apply_exif_orientation(img, &args.input);
    
    // Preprocessing: Brightness
    if final_brightness != 0 {
        img = img.brighten(final_brightness);
    }

    // Preprocessing: Contrast
    if (final_contrast - 1.0).abs() > f32::EPSILON {
        img = img.adjust_contrast(final_contrast);
    }
    
    // Convert input to grayscale for processing
    let gray_img = img.to_luma8();

    // Process image using the new module
    let out_img = processor::process_image(&gray_img, final_scale, final_angle, final_shape.clone());

    out_img.save(&args.output)?;
    println!(
        "Processed {:?} -> {:?} | Scale: {}, Angle: {}, Shape: {:?}, Brightness: {}, Contrast: {}",
        args.input, args.output, final_scale, final_angle, final_shape, final_brightness, final_contrast
    );

    Ok(())
}
