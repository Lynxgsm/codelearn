// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    env,
    fs::{self, File},
    io::{BufWriter, Read, Write},
    path::{Path, PathBuf},
    thread,
};

mod init;

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};
use warp::Filter;
use zip::ZipWriter;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}
#[derive(Clone, serde::Serialize)]
struct ChallengePaths {
    starter: String,
    json: String,
    description: String,
    test: String,
}

fn write_file(content: &str, test_path: String) {
    // Open the file in write mode
    let mut file = File::create(test_path).expect("Failed to create file");

    // Write the content to the file
    match file.write_all(content.as_bytes()) {
        Ok(_) => {
            // Content written successfully
            println!("Content written to file.");
        }
        Err(e) => {
            // Error writing to file
            println!("Error writing to file: {}", e);
        }
    }
}

fn read_file(code: String, test: String, template_path: String, test_path: String) {
    // Open the file in read-only mode
    let file = File::open(template_path);

    if let Ok(current_dir) = env::current_dir() {
        println!("Current directory: {:?}", current_dir);
    } else {
        println!("Failed to retrieve the current directory.");
    }

    // Check if the file was successfully opened
    match file {
        Ok(mut file) => {
            // Create a buffer to hold the file contents
            let mut buffer = String::new();

            // Read the file contents into the buffer
            match file.read_to_string(&mut buffer) {
                Ok(_) => {
                    // File read successfully
                    buffer = buffer.replace("#CODE", &code);
                    buffer = buffer.replace("#TEST", &test);
                    write_file(&buffer, test_path);
                }
                Err(e) => {
                    // Error reading the file
                    println!("Error reading file: {}", e);
                }
            }
        }
        Err(e) => {
            // Error opening the file
            println!("Error opening file: {}", e);
        }
    }
}

#[tauri::command]
fn create_test_file(template_path: String, test_path: String, code: String, test: String) {
    read_file(code, test, template_path, test_path);
}

#[allow(clippy::too_many_arguments)]
#[tauri::command]
fn generate_challenge(
    challenge_path: String,
    zip_path: String,
    test_path: String,
    test_content: String,
    starter_path: String,
    starter_content: String,
    json_path: String,
    json_content: String,
    description_path: String,
    description_content: String,
) {
    let path = Path::new(&challenge_path);
    match fs::create_dir(path) {
        Ok(_) => println!("Directory successfully created"),
        Err(err) => println!("{:?}", err),
    }

    // Test file
    write_file(&test_content, test_path);

    // Starter file
    write_file(&starter_content, starter_path);

    // JSON file
    write_file(&json_content, json_path);

    // Description file
    write_file(&description_content, description_path);

    // Zip file and move to another directory
    let file = File::create(zip_path).unwrap();
    let mut zip_writer = ZipWriter::new(BufWriter::new(file));

    // Recursively add files and directories to the zip archive
    init::zip_folder(&challenge_path, "", &mut zip_writer).unwrap();
}

#[tauri::command]
fn list_challenges(challenge_path: String) -> Vec<String> {
    match fs::read_dir(challenge_path) {
        Ok(entries) => {
            let directory_names: Vec<String> = entries
                .filter_map(|entry| {
                    if let Ok(entry) = entry {
                        if entry.file_type().unwrap().is_dir() {
                            Some(entry.file_name().to_string_lossy().into_owned())
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                })
                .collect();

            directory_names
        }
        Err(e) => {
            eprintln!("Error reading directory: {}", e);
            Vec::new()
        }
    }
}

#[tauri::command]
fn importing_challenge(file_extraction_path: String, file_path: String, challenge_path: String) {
    match fs::create_dir(&file_extraction_path) {
        Ok(_) => println!("Directory successfully created"),
        Err(err) => println!("{:?}", err),
    }

    init::unzip_file(&file_path, &file_extraction_path);
}

#[tauri::command]
fn load_challenge(
    starter_path: String,
    json_path: String,
    description_path: String,
    test_path: String,
) -> ChallengePaths {
    let starter = init::read_file(starter_path);
    let json = init::read_file(json_path);
    let description = init::read_file(description_path);
    let test = init::read_file(test_path);

    ChallengePaths {
        starter,
        json,
        description,
        test,
    }
}

fn main() {
    // CUSTOM MENU
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let import_challenge = CustomMenuItem::new("import_challenge", "Import challenge");
    let submenu = Submenu::new(
        "File",
        Menu::new()
            .add_item(quit)
            .add_item(close)
            .add_item(import_challenge),
    );

    let menu = Menu::new()
        .add_native_item(MenuItem::Copy)
        .add_item(CustomMenuItem::new("hide", "Hide"))
        .add_submenu(submenu);

    let app = tauri::Builder::default().setup(|app| {
        let resource_path = app
            .path_resolver()
            .resolve_resource("../dist")
            .expect("failed to resolve resource");

        let challenge_path = app
            .path_resolver()
            .resolve_resource("../dist/challenges")
            .expect("failed to resolve resource");

        init::create_challenge_directory(&challenge_path);

        thread::spawn(move || {
            server(resource_path);
        });

        Ok(())
    });

    app.invoke_handler(tauri::generate_handler![
        create_test_file,
        list_challenges,
        generate_challenge,
        importing_challenge,
        load_challenge
    ])
    .menu(menu)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tokio::main]
async fn server(path: PathBuf) {
    let static_files = warp::fs::dir(path);
    // Define the routes
    let cors = warp::cors()
        .allow_any_origin()
        .allow_methods(vec!["GET", "POST"]);

    let routes = warp::path("static").and(static_files).with(cors);
    // Start the server
    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}
