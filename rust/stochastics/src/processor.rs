use image::{GrayImage, Luma, RgbImage, Rgb};
use crate::config::DotShape;

/// Process a single channel (grayscale or separated color channel)
pub fn process_channel(img: &GrayImage, scale: f32, angle: f32, shape: DotShape) -> GrayImage {
    let (width, height) = img.dimensions();
    let mut out_img = GrayImage::new(width, height);

    // Rotation from input angle
    let theta = angle.to_radians();
    let cos_theta = theta.cos();
    let sin_theta = theta.sin();

    // Frequency of the screen (inverse of scale/period)
    // Scale roughly corresponds to the distance between dots in pixels
    let frequency = std::f32::consts::PI / scale;

    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let intensity = pixel[0] as f32 / 255.0;

            // Rotate coordinates
            let u = x as f32 * cos_theta - y as f32 * sin_theta;
            let v = x as f32 * sin_theta + y as f32 * cos_theta;

            // Screen function calculation
            let screen_val = match shape {
                DotShape::Euclidean => {
                    // Classic "Euclidean" (Cosine-based): (cos(u) + cos(v)) / 2
                    // Range: [-1, 1]
                    ((u * frequency).cos() + (v * frequency).cos()) / 2.0
                }
                DotShape::Line => {
                    // Line screen: cos(u)
                    // Range: [-1, 1]
                    (u * frequency).cos()
                }
                DotShape::Round => {
                    // For now, falling back to Euclidean as a robust default for "Round"
                    // until a specific super-cell implementation is added.
                    ((u * frequency).cos() + (v * frequency).cos()) / 2.0
                }
            };

            // Map intensity to threshold range.
            // Screen goes from -1 (blackest) to 1 (whitest, peaks).
            // We want intensity 0 -> Black, 1 -> White.
            // If screen_val < mapped_intensity, then White, else Black?
            // Let's align:
            // High intensity (light) should be White.
            // If intensity is 1.0, we want output White almost always.
            // If intensity is 0.0, we want output Black almost always.
            
            // Standard Thresholding:
            // Normalize screen to [0, 1]
            let norm_screen = (screen_val + 1.0) / 2.0;
            
            // However, dot screens are often inverted depending on print.
            // Let's stick to: Output White if Intensity > Screen
            
            let new_pixel = if intensity > norm_screen {
                Luma([255])
            } else {
                Luma([0])
            };

            out_img.put_pixel(x, y, new_pixel);
        }
    }

    out_img
}

/// Process a color image by separating channels and applying different screen angles
pub fn process_image_color(img: &RgbImage, scale: f32, angle: f32, shape: DotShape) -> RgbImage {
    let (width, height) = img.dimensions();
    
    // Separate channels
    // We treat RGB as approximations for CMY for screen angles to avoid moire
    // Red Channel (Cyan-ish role): Angle + 15
    // Green Channel (Magenta-ish role): Angle + 75
    // Blue Channel (Yellow-ish role): Angle + 0
    // Ideally we would convert to CMYK, but processing RGB directly with offset angles is a common approximation.
    
    // Create new images for each channel to process them as grayscale
    let mut r_img = GrayImage::new(width, height);
    let mut g_img = GrayImage::new(width, height);
    let mut b_img = GrayImage::new(width, height);

    for y in 0..height {
        for x in 0..width {
            let p = img.get_pixel(x, y);
            r_img.put_pixel(x, y, Luma([p[0]]));
            g_img.put_pixel(x, y, Luma([p[1]]));
            b_img.put_pixel(x, y, Luma([p[2]]));
        }
    }

    let r_out = process_channel(&r_img, scale, angle + 15.0, shape.clone());
    let g_out = process_channel(&g_img, scale, angle + 75.0, shape.clone());
    let b_out = process_channel(&b_img, scale, angle + 0.0, shape); // Blue often stays at 0 or 90

    // Recombine
    let mut out_img = RgbImage::new(width, height);
    for y in 0..height {
        for x in 0..width {
            let r = r_out.get_pixel(x, y)[0];
            let g = g_out.get_pixel(x, y)[0];
            let b = b_out.get_pixel(x, y)[0];
            out_img.put_pixel(x, y, Rgb([r, g, b]));
        }
    }

    out_img
}
