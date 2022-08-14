const express = require('express');
const inquirer = require('inquirer');
const cTable = require('console.table');
// Import and require mysql2
const mysql = require('mysql2');

// const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'P4ssword!',
    database: 'company_db',
  },
  console.log(`Connected to the company_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

function mainMenu() {
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all employees',
          'Add and employee',
          'Update an employee role',
          'View all roles',
          'Add a role',
          'View all departments',
          'Add a department',
          'Quit',
        ],
      },
    ])
    .then((answers) => {
      if (answers.action == 'View all employees') {
        viewAllEmployees();
      } else if (answers.action == 'Add and employee') {
        addEmployee();
      } else if (answers.action == 'Update an employee role') {
        updateEmployee();
      } else if (answers.action == 'View all roles') {
        viewAllRoles();
      } else if (answers.action == 'Add a role') {
        addRoll();
      } else if (answers.action == 'View all departments') {
        viewAllDepartments();
      } else if (answers.action == 'Add a department') {
        addDepartment();
      } else {
        quit();
      }
    });
}

function viewAllEmployees() {
  db.query(
    'SELECT EMP.id AS id, EMP.first_name AS first_name, EMP.last_name AS last_name, ROL.title AS job_title, DEPT.name AS department, ROL.salary AS salary, EMP.manager_id AS manager FROM employee AS EMP JOIN role AS ROL ON EMP.role_id = ROL.id JOIN department AS DEPT ON ROL.department_id = DEPT.id;',
    function (err, results) {
      console.table(results);
    }
  );
  mainMenu();
}

function init() {
  console.log('WELCOME TO THE COMPANY EMPLOYEE TRACKER');
  mainMenu();
}

init();
