# Teacher_Student

How to start the program
pre-requisite: docker engine is running
1. docker-compose up --build
2. Runs on port 3001 (localhost:3001)

How to access unit test
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm backend npm test

Routes tagged with *** is for the test
All available routes:
[method][route] -> [body] -> [function]
-------------------------Teachers-----------------------------------
[get] /teacher -> [] -> get all teachers in teacher table

[post] /teacher -> {"email" : "example@gmail.com"} -> create a new teacher 

[delete] /teacher -> {"email" : "example@gmail.com"} -> deletes an existing teacher


-------------------------Students-----------------------------------
[get] /student -> [] -> get all students in student table

[post] /student -> {"email" : "example@gmail.com"} -> create a new student 

[delete] /student -> {"email" : "example@gmail.com"} -> deletes an existing student

***[post] /api/suspend -> {"student": "example@gmail.com"} -> suspends a student

[post] /api/unsuspend -> {"student": "example@gmail.com"} -> unsuspends a student

-------------------------Teacher_Student-----------------------------
[get] /api/teacherstudent -> [] -> get all teacher-student relationship in table

***[post] /api/register -> {"teacher": "example@gmail.com", "students":["example1@gmail.com","example2@gmail.com"]} -> links students to a teacher

***[get] /api/commonstudents -> ?teacher=example%40gmail.com&?teacher=example2%40gmail.com -> get common students between teachers

***[post] /api/retrievefornotifications -> {"teacher":"example@gmail.com", "notification":"Hello! @example2@gmail.com"} -> returns recipients