package main

import (
	"fmt"
	"log"
	"net/http"
)

// Port we listen on.
const portNum string = ":9000"

// Handler functions.
func Home(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Homepage")
}

func main() {
	log.Println("Starting our simple https server.")

	// Registering our handler functions, and creating paths.
	http.HandleFunc("/", Home)
	// Spinning up the server.
	err := http.ListenAndServeTLS(portNum, "server.crt", "server.key", nil)
	// http.ListenAndServe(, nil)
	if err != nil {
		log.Fatal(err)
	}
}
