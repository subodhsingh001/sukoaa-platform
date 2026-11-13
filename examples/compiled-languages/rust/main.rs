use std::io;

fn main() {
    let mut name = String::new();
    io::stdin().read_line(&mut name).expect("Could not read input");
    let name = if name.trim().is_empty() { "Sukoaa" } else { name.trim() };
    let squares: Vec<i32> = (1..=5).map(|n| n * n).collect();
    println!("Hello, {}!", name);
    println!("Sum of squares: {}", squares.iter().sum::<i32>());
}
