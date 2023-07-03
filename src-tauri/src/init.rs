use std::fs;

pub fn create_challenge_directory(challenge_path: String) {
    match fs::create_dir(challenge_path) {
        Ok(_) => println!("Directory successfully created"),
        Err(err) => println!("{:?}", err),
    }
}
