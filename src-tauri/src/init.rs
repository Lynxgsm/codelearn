use std::fs::File;
use std::io::{BufReader, BufWriter};
use std::{fs, path::PathBuf};

use zip::write::FileOptions;
use zip::ZipWriter;

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
