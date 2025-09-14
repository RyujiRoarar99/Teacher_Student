# Teacher_Student

How to start the program <br />
pre-requisite: docker engine is running
1. docker-compose up --build
2. Runs on port 3001 (localhost:3001)

How to access unit test: <br />
docker compose -f docker-compose.yml -f docker-compose.test.yml run --rm backend npm test<br />
<br />
Routes tagged with *** is for the test <br />
All available routes: <br />
[method][route] -> [body] -> [function] <br />
-------------------------Teachers----------------------------------- <br />
[get] /teacher -> [] -> get all teachers in teacher table <br />
<br />
[post] /teacher -> {"email" : "example@gmail.com"} -> create a new teacher  <br />
<br />
[delete] /teacher -> {"email" : "example@gmail.com"} -> deletes an existing teacher<br />
<br />
<br />
-------------------------Students-----------------------------------<br />
[get] /student -> [] -> get all students in student table<br />
<br />
[post] /student -> {"email" : "example@gmail.com"} -> create a new student <br />
<br />
[delete] /student -> {"email" : "example@gmail.com"} -> deletes an existing student<br />
<br />
***[post] /api/suspend -> {"student": "example@gmail.com"} -> suspends a student<br />
<br />
[post] /api/unsuspend -> {"student": "example@gmail.com"} -> unsuspends a student<br />
<br />
-------------------------Teacher_Student-----------------------------<br />
[get] /api/teacherstudent -> [] -> get all teacher-student relationship in table<br />
<br />
***[post] /api/register -> {"teacher": "example@gmail.com", "students":["example1@gmail.com","example2@gmail.com"]} -> links students to a teacher<br />
<br />
***[get] /api/commonstudents -> ?teacher=example%40gmail.com&?teacher=example2%40gmail.com -> get common students between teachers<br />
<br />
***[post] /api/retrievefornotifications -> {"teacher":"example@gmail.com", "notification":"Hello! @example2@gmail.com"} -> returns recipients<br />
