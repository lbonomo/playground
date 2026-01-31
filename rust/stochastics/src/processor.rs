use image::{GrayImage, Luma, RgbImage, Rgb};
use crate::config::DotShape;



/// Process a single channel (grayscale or separated color channel)
pub fn process_channel(img: &GrayImage, scale: f32, angle: f32, shape: DotShape) -> GrayImage {
    let (width, height) = img.dimensions();
    let mut out_img = GrayImage::new(width, height);

    // Rotation from input angle
    // offset 90 degrees so 0 is horizontal right
    let theta = (angle + 90.0).to_radians();
    let cos_theta = theta.cos();
    let sin_theta = theta.sin();

    // Frequency of the screen (inverse of scale/period)
    let frequency = std::f32::consts::PI * 2.0 / scale;
    let two_pi = 2.0 * std::f32::consts::PI;

    for y in 0..height {
        for x in 0..width {
            let pixel = img.get_pixel(x, y);
            let intensity = pixel[0] as f32 / 255.0;

            // Ideal coordinate logic:
            // 1. Map (x, y) to rotated screen space (u, v)
            let u = x as f32 * cos_theta - y as f32 * sin_theta;
            let v = x as f32 * sin_theta + y as f32 * cos_theta;

            // 2. Determine "cell" coordinates in phase space
            let phase_u = u * frequency;
            let phase_v = v * frequency;

            // 4. Apply Screen Function
            let screen_val = match shape {
                DotShape::Euclidean => {
                    // Cosine-based: (cos(u) + cos(v)) / 2
                    ((phase_u).cos() + (phase_v).cos()) / 2.0
                }
                DotShape::Line => {
                     // Line screen: cos(u)
                     (phase_u).cos()
                }
                DotShape::Round => {
                    // Distance based.
                    // Center of nearest peak in Cosine space is at multiples of 2*PI.
                    let du = phase_u - (phase_u / two_pi).round() * two_pi;
                    let dv = phase_v - (phase_v / two_pi).round() * two_pi;
                    
                    // Distance from center (0,0) in phase space
                    let dist = (du * du + dv * dv).sqrt();
                    
                    // Linear Cone: 1.0 - (dist / Normalizer)
                    // Let Max = PI * sqrt(2).
                    let max_dist = std::f32::consts::PI * std::f32::consts::SQRT_2;
                    1.0 - 2.0 * (dist / max_dist)
                }
            };
            
            // 5. Threshold
            let norm_screen = (screen_val + 1.0) / 2.0;

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
