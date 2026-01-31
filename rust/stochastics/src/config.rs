use serde::Deserialize;
use std::fs;
use std::path::Path;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "lowercase")]
pub enum DotShape {
    Euclidean,
    Round,
    Line,
}

#[derive(Debug, Deserialize)]
pub struct Config {
    pub scale: Option<f32>,
    pub angle: Option<f32>,
    pub brightness: Option<i32>,
    pub contrast: Option<f32>,
    pub shape: Option<DotShape>,
    pub color: Option<bool>,
}

impl Config {
    pub fn load_from_file<P: AsRef<Path>>(path: P) -> Result<Self, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(path)?;
        let config = serde_json::from_str(&content)?;
        Ok(config)
    }
}
