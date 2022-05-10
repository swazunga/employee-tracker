const inquirer = require("inquirer");
const mysql = require("mysql2");
require("console.table");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "company",
  password: "",
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  startup();
});

function startup() {
  inquirer
    .prompt({
      type: "list",
      name: "firstQuestion",
      message: "What would you like to do?",
      choices: [
        "View Departments",
        "View Roles",
        "View Employees",
        "Add Department",
        "Add Role",
        "Add Employee",
        "Update Employee's Role",
      ],
    })
    .then((choice) => {
      console.log(choice);
      if (choice.firstQuestion === "View Departments") {
        viewDepartments();
      }
      if (choice.firstQuestion === "View Roles") {
        viewRoles();
      }
      if (choice.firstQuestion === "View Employees") {
        viewEmployees();
      }
      if (choice.firstQuestion === "Add Department"){
          addDepartment();
      }
    });
}

function viewDepartments() {
  const sqlCall = "SELECT * FROM department";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
  });
}

function viewRoles() {
  const sqlCall = "SELECT * FROM role";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
  });
}

function viewEmployees() {
  const sqlCall = "SELECT * FROM employee";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
  });
}

function addDepartment() {
    inquirer.prompt({
        type: "input",
        name: "department",
        message: "Which department would you like to add?",

    }).then((answers) => )
}