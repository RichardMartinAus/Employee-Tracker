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
        addRole();
      } else if (answers.action == 'View all departments') {
        viewAllDepartments();
      } else if (answers.action == 'Add a department') {
        addDepartment();
      } else {
        quit();
      }
    });
}

const viewAllEmployees = () =>
  new Promise((resolve, reject) => {
    db.query(
      'SELECT EMP.id, EMP.first_name, EMP.last_name, ROL.title AS job_title, DEPT.name AS department, ROL.salary, CONCAT(MAN.first_Name, " ",MAN.last_name) AS manager FROM employee AS EMP JOIN role AS ROL ON EMP.role_id = ROL.id LEFT JOIN employee as MAN ON EMP.manager_id = MAN.id JOIN department AS DEPT ON ROL.department_id = DEPT.id;',
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(console.table(results), mainMenu());
        }
      }
    );
  });

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'emp_fname',
        message: 'What is the employees first name?',
      },
      {
        type: 'input',
        name: 'emp_lname',
        message: 'What is the employees last name?',
      },
      {
        type: 'list',
        name: 'emp_role',
        message: 'What is the employees roll?',
        choices: [
          'Sales Lead',
          'Salesperson',
          'Lead Engineer',
          'Software Engineer',
          'Account Manager',
          'Accountant',
          'Legal Team Lead',
          'Lawyer',
        ],
      },
      {
        type: 'list',
        name: 'emp_manager',
        message: 'Who is the employees manager? (Enter Null if no manager)',
        choices: [
          'John Doe',
          'Ashley Rodriguez',
          'Kunal Singh',
          'Sarah Lourd',
          'Null',
        ],
      },
    ])
    .then((answers) => {
      let roleId = function (answers) {
        if (answers.emp_role === 'Sales Lead') {
          return 1;
        } else if (answers.emp_role === 'Salesperson') {
          return 2;
        } else if (answers.emp_role === 'Lead Engineer') {
          return 3;
        } else if (answers.emp_role === 'Software Engineer') {
          return 4;
        } else if (answers.emp_role === 'Account Manager') {
          return 5;
        } else if (answers.emp_role === 'Accountant') {
          return 6;
        } else if (answers.emp_role === 'Legal Team Lead') {
          return 7;
        } else if (answers.emp_role === 'Lawyer') {
          return 8;
        }
        console.log(roleId);
      };

      let managerId = function (answers) {
        if (answers.emp_manager === 'John Doe') {
          return 1;
        } else if (answers.emp_manager === 'Ashley Rodriguez') {
          return 3;
        } else if (answers.emp_manager === 'Kunal Singh') {
          return 5;
        } else if (answers.emp_manager === 'Sarah Lourd') {
          return 7;
        } else if (answers.emp_manager === 'Null') {
          return 'Null';
        }
        console.log(managerId);
      };

      db.query(
        `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.emp_fname}", "${answers.emp_lname}", ${roleId}, ${managerId});`,
        function (err, results) {
          console.log('New employee added'), mainMenu();
        }
      );
    });
}

const viewAllRoles = () =>
  new Promise((resolve, reject) => {
    db.query(
      'SELECT RO.id AS id, RO.title AS title, DE.name AS department, RO.salary AS salary FROM role RO JOIN department DE ON RO.department_id = DE.id;',
      function (err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(console.table(results), mainMenu());
        }
      }
    );
  });

function addRole() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'roleName',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'input',
        name: 'deptId',
        message: 'What is the departments ID? (1 - 5)',
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO role (title, salary, department_id) VALUES ("${answers.roleName}", ${answers.salary}, ${answers.deptId});`,
        function (err, results) {
          console.log('New department added'), mainMenu();
        }
      );
    });
}

const viewAllDepartments = () =>
  new Promise((resolve, reject) => {
    db.query('SELECT * FROM department;', function (err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(console.table(results), mainMenu());
      }
    });
  });

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'deptName',
        message: 'What is the name of the department?',
      },
    ])
    .then((answers) => {
      db.query(
        `INSERT INTO department (name) VALUES ("${answers.deptName}");`,
        function (err, results) {
          console.log('New department added'), mainMenu();
        }
      );
    });
}

function init() {
  console.log('WELCOME TO THE COMPANY EMPLOYEE TRACKER');
  mainMenu();
}

function quit() {
  process.exit(1);
}

init();
