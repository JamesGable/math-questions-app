package main

import (
    "encoding/json"
    "net/http"
    "github.com/gorilla/mux"
	"github.com/rs/cors"
)

// Student represents a student with Personal Needs and Preferences (PNP)
type Student struct {
    ID          string `json:"id"`
    Name        string `json:"name"`
    PersonalPNP PNP    `json:"personalPNP"`
}

// PNP represents the Personal Needs and Preferences for a student
type PNP struct {
    DarkMode     bool `json:"darkMode"`
    LargeText    bool `json:"largeText"`
    TextToSpeech bool `json:"textToSpeech"`
}

var students = make(map[string]Student) // Map to store student data by student ID

func init() {
    // Initialize dummy student data
    students["1"] = Student{
        ID:   "1",
        Name: "Gwynn",
        PersonalPNP: PNP{
            DarkMode:     false,
            LargeText:    true,
            TextToSpeech: true,
        },
    }

    // Adding more dummy students
    students["2"] = Student{
        ID:   "2",
        Name: "James",
        PersonalPNP: PNP{
            DarkMode:     true,
            LargeText:    false,
            TextToSpeech: false,
        },
    }

    students["3"] = Student{
        ID:   "3",
        Name: "Nolan",
        PersonalPNP: PNP{
            DarkMode:     true,
            LargeText:    true,
            TextToSpeech: true,
        },
    }
}

// GetPNP handles GET requests to retrieve PNP settings for a student
func GetPNP(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    studentID := params["studentId"]
    if student, ok := students[studentID]; ok {
        json.NewEncoder(w).Encode(student.PersonalPNP)
    } else {
        w.WriteHeader(http.StatusNotFound)
    }
}

// UpdatePNP handles POST requests to update PNP settings for a student
func UpdatePNP(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    studentID := params["studentId"]
    if student, ok := students[studentID]; ok {
        var pnp PNP
        json.NewDecoder(r.Body).Decode(&pnp)
        student.PersonalPNP = pnp
        students[studentID] = student
        json.NewEncoder(w).Encode(student.PersonalPNP)
    } else {
        w.WriteHeader(http.StatusNotFound)
    }
}

func main() {
    router := mux.NewRouter()
    router.HandleFunc("/pnp/{studentId}", GetPNP).Methods("GET")
    router.HandleFunc("/pnp/{studentId}", UpdatePNP).Methods("POST")

    // Set up CORS
    c := cors.New(cors.Options{
        AllowedOrigins: []string{"http://localhost:3000"}, // Allows frontend server
        AllowedMethods: []string{"GET", "POST", "OPTIONS"},
        AllowedHeaders: []string{"Content-Type"},
    })

    // Use the CORS middleware
    handler := c.Handler(router)

    http.ListenAndServe(":8080", handler)
}
