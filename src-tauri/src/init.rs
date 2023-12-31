use std::fs::File;
use std::io::{BufReader, BufWriter, Read};
use std::path::Path;
use std::{fs, path::PathBuf};

use zip::write::FileOptions;
use zip::{ZipArchive, ZipWriter};

pub fn create_challenge_directory(challenge_path: &PathBuf) {
    match fs::create_dir(challenge_path) {
        Ok(_) => println!("Directory successfully created"),
        Err(err) => println!("{:?}", err),
    }
}

pub fn zip_folder(
    folder_path: &str,
    parent_path: &str,
    zip_writer: &mut ZipWriter<BufWriter<File>>,
) -> zip::result::ZipResult<()> {
    let folder = std::fs::read_dir(folder_path)?;

    for entry in folder {
        let entry = entry?;
        let path = entry.path();
        let name = entry.file_name().into_string().unwrap();

        if path.is_dir() {
            let mut new_parent_path = String::from(parent_path);
            new_parent_path.push_str(&name);
            new_parent_path.push('/');

            // Recursive call to zip subdirectories
            zip_folder(&path.to_string_lossy(), &new_parent_path, zip_writer)?;
        } else {
            let file = File::open(&path)?;
            zip_writer.start_file(
                format!("{}{}", parent_path, name.replace('\\', "/")),
                FileOptions::default(),
            )?;
            let mut buffer = BufReader::new(file);
            std::io::copy(&mut buffer, zip_writer)?;
        }
    }

    Ok(())
}

pub fn unzip_file(
    zip_file_path: &str,
    extract_to_path: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let file = File::open(zip_file_path)?;
    let mut archive = ZipArchive::new(file)?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)?;
        let file_path = file.sanitized_name();

        // Extract only regular files, ignore directories and symbolic links
        if !file.name().ends_with('/') {
            let mut output_file = File::create(Path::new(extract_to_path).join(file_path))?;
            std::io::copy(&mut file, &mut output_file)?;
        }
    }

    println!("Challenge extracted");

    Ok(())
}

pub fn read_file(file_path: String) -> String {
    let file = File::open(file_path);

    match file {
        Ok(mut file) => {
            // Create a buffer to hold the file contents
            let mut buffer = String::new();

            // Read the file contents into the buffer
            match file.read_to_string(&mut buffer) {
                Ok(_) => {
                    // File read successfully
                    buffer
                }
                Err(e) => {
                    // Error reading the file
                    println!("Error reading file: {}", e);
                    String::new()
                }
            }
        }
        Err(e) => {
            // Error opening the file
            println!("Error opening file: {}", e);
            String::new()
        }
    }
}
