package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Data struct {
	Title        string `json:"title"`
	Subtitle     string `json:"subtitle"`
	Environments map[string][]struct {
		Name string `json:"name"`
		Url  string `json:"url"`
	} `json:"environments"`
}

var filePath = os.Getenv("DB_FILE_PATH")

func enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			return
		}
		next.ServeHTTP(w, r)
	})
}

func getTitleAndSubtitle(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Unable to open db.json", http.StatusInternalServerError)
		log.Println("Error opening db.json:", err)
		return
	}
	defer file.Close()

	var data Data
	err = json.NewDecoder(file).Decode(&data)
	if err != nil {
		http.Error(w, "Unable to parse JSON", http.StatusInternalServerError)
		log.Println("Error parsing db.json:", err)
		return
	}

	response := map[string]string{
		"title":    data.Title,
		"subtitle": data.Subtitle,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getEnvironments(w http.ResponseWriter, r *http.Request) {
	file, err := os.Open(filePath)
	if err != nil {
		http.Error(w, "Unable to open db.json", http.StatusInternalServerError)
		log.Println("Error opening db.json:", err)
		return
	}
	defer file.Close()

	var data Data
	err = json.NewDecoder(file).Decode(&data)
	if err != nil {
		http.Error(w, "Unable to parse JSON", http.StatusInternalServerError)
		log.Println("Error parsing db.json:", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data.Environments)
}

func main() {
	if filePath == "" {
		filePath = "db.json"
	}
	http.Handle("/api/title_and_subtitle", enableCors(http.HandlerFunc(getTitleAndSubtitle)))
	http.Handle("/api/environments", enableCors(http.HandlerFunc(getEnvironments)))

	fmt.Println("Server is listening on port 7956..")
	log.Fatal(http.ListenAndServe("0.0.0.0:7956", nil))

}
