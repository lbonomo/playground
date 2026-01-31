use image::{GrayImage, Luma};
use crate::config::DotShape;

pub fn process_image(img: &GrayImage, scale: f32, angle: f32, shape: DotShape) -> GrayImage {
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
