// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    env,
    fs::File,
    io::{Read, Write},
    path::PathBuf,
    thread,
};

use warp::Filter;

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

fn main() {
    let app = tauri::Builder::default().setup(|app| {
        let resource_path = app
            .path_resolver()
            .resolve_resource("../dist")
            .expect("failed to resolve resource");

        thread::spawn(move || {
            server(resource_path);
        });

        Ok(())
    });
    app.invoke_handler(tauri::generate_handler![create_test_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tokio::main]
async fn server(path: PathBuf) {
    let static_files = warp::fs::dir(path);
    // Define the routes
    let routes = warp::path("static").and(static_files);
    // Start the server
    warp::serve(routes).run(([127, 0, 0, 1], 8000)).await;
}
