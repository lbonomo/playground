#! /bin/bash

cargo build --release

angle=17

./target/release/stochastics --input muestra/puente.jpg --output muestra/example-1.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape round
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-2.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape euclidean
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-3.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape line
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-4.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape round --color
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-5.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape euclidean --color
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-6.png --scale 10 --angle $angle --brightness 10 --contrast 1 --shape line --color
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-7.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape round
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-8.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape euclidean
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-9.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape line
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-10.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape round --color
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-11.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape euclidean --color
./target/release/stochastics --input muestra/puente.jpg --output muestra/example-12.png --scale 30 --angle $angle --brightness 10 --contrast 1 --shape line --color
