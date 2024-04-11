# Simple courseware and class attendance web application
This web applicaiton is a Web technologies course project assignment. The goal of the project was development of a simple courseware and class attendance web application. The project was completed through 4 iterations. All implemented features adhere to the project specification.
## Description and features
1. Iteration (***spirala1*** branch) - Implemented static site **predmet.html** with grid list of courses by department and year of study. Navigation menu is located at the top of the page and contains links to courses for each year of study and department. The layout changes for screen width under 300px. Also implemented static **prisustvo.html** which represents the attendance table for students of a course.
2. Iteration (***spirala2*** branch) - Implemented **TabelaPrisustvo.js** module which accepts two arguments, the first one is an DOM element reference, and the second one is a JSON object which contains students and their attendance data. The module draws an attendance table (resembling the static table in **prisustvo.html**) in the DOM element passed as the first argument for students and data from the second argument. The module erases all content of the passed DOM element and validates the attendance data. Under the table are two buttons which allow changing the week for which detailed attendance is shown.
3. Iteration (***spirala3*** branch) - Added Express backend. All previous work is served through the backend as static content. Added sessions with cookies, implemented login form, added login/logout button to all pages. The login form is avaliable at http://localhost:3000/prijava.html. The login functionality is intended for course lecturers ([sample login credentials at the end of the document](#sample-login-credentials)). After login the user is redirected to http://localhost:3000/predmeti.html. The top menu displays the lecturer's courses. Selecting a course displays the attendace table. The lecturer can add attendance data by clicking on fields denoting lecture or laboratory classes. Green field denote attented class, red denote no attendance, and white denote no attendance data yet.
4. Iteration (***master*** branch) - Instead of using JSON files data is persisted in a MySQL database. All database operations are done using Sequelize object-relational mapper
## Technologies used
### Frontend
Vanilla **HTML**, **CSS** and **JavaScript**
### Backend
**Node.js** with **Express** framework, **Sequelize** ORM
### Database
Initially **MySQL**, switched to **SQLite** for simplicity (no separate service needed)
## How to run
1. Install all dependencies with ```npm install```
2. Run application with ```node index.js```. The application will run on port 3000.
## Sample login credentials
There are 4 lecturers with different courses and attendance data. Login credentials are below.
| Username  | Password |
| ------------- | ------------- |
| nastavnik1  | password1  |
| nastavnik2  | password2  |
| nastavnik3  | password3  |
| nastavnik4  | password4  |
