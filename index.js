const inquirer = require("inquirer");
const mysql = require("mysql2");
const { allowedNodeEnvironmentFlags } = require("process");
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
        "Quit",
      ],
    })
    .then((choice) => {
      if (choice.firstQuestion === "View Departments") {
        viewDepartments();
      }
      if (choice.firstQuestion === "View Roles") {
        viewRoles();
      }
      if (choice.firstQuestion === "View Employees") {
        viewEmployees();
      }
      if (choice.firstQuestion === "Add Department") {
        addDepartment();
      }
      if (choice.firstQuestion === "Add Role") {
        addRole();
      }
      if (choice.firstQuestion === "Add Employee") {
        addEmployee();
      }
      if (choice.firstQuestion === "Update Employee's Role") {
        updateEmployee();
      } else return;
    });
}

function viewDepartments() {
  const sqlCall = "SELECT * FROM department";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
    startup();
  });
}

function viewRoles() {
  const sqlCall = "SELECT * FROM role";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    console.table(results);
    startup();
  });
}

function viewEmployees() {
  const sqlCall = "SELECT * FROM employee";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }

    console.table(results);
    startup();
  });
}

function addDepartment() {
  inquirer
    .prompt({
      type: "input",
      name: "department",
      message: "Which department would you like to add?",
    })
    .then((choice) => {
      const deptStr = choice.department;
      const sqlCall = `INSERT INTO department (name) VALUES (?)`;
      connection.query(sqlCall, [deptStr], function (error, results) {
        if (error) {
          throw error;
        }
        console.table(results);
        startup();
      });
    });
}

function addRole() {
  const sqlCall = "SELECT * FROM department";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    const deptArray = results.map((department) => department.name);
    const roleQ = [
      {
        type: "input",
        name: "title",
        message: "What is the title of the role you want to create?",
      },
      {
        type: "input",
        name: "salary",
        message: "What is the salary of the role you want to create?",
      },
      {
        type: "list",
        name: "departmentId",
        message: "Which department will this role fall under?",
        choices: deptArray,
      },
    ];
    inquirer.prompt(roleQ).then((answer) => {
      console.log(answer.title);
      const dept = results.find((department) => answer.departmentId);
      const sqlCall = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
      connection.query(
        sqlCall,
        [answer.title, answer.salary, dept.id],
        function (error, results) {
          if (error) {
            throw error;
          }
          console.table(results);
          startup();
        }
      );
    });
  });
}

function addEmployee() {
  const sqlCall = "SELECT id, title FROM role";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    const roleArray = results.map((role) => role.title);
    const roleList = results;
    connection.query("SELECT * FROM employee", function (error, results) {
      if (error) {
        throw error;
      }
      const managerArray = results.map(
        (manager) => manager.first_name + " " + manager.last_name
      );
      const managerList = results;
      const employeeQ = [
        {
          type: "input",
          name: "first",
          message: "What is the first name of the new employee?",
        },
        {
          type: "input",
          name: "last",
          message: "What is the last name of the new employee?",
        },
        {
          type: "list",
          name: "role",
          message: "Which role will this new employee fill?",
          choices: roleArray,
        },
        {
          type: "list",
          name: "manager",
          message: "Who is the manager of the new employee?",
          choices: managerArray,
        },
      ];
      inquirer.prompt(employeeQ).then((answer) => {
        const role = roleList.find((role) => role.title === answer.role);
        const manager = managerList.find((manager) => {
          const fullName = manager.first_name + " " + manager.last_name;
          return fullName === answer.manager;
        });
        console.log(roleList, role);
        const sqlCall =
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
        connection.query(
          sqlCall,
          [answer.first, answer.last, role.id, manager.id],
          function (error, results) {
            if (error) {
              throw error;
            }
            startup();
          }
        );
      });
    });
  });
}

function updateEmployee() {
  const sqlCall = "SELECT * FROM employee";
  connection.query(sqlCall, function (error, results) {
    if (error) {
      throw error;
    }
    const employeeList = results;
    const employeeArray = results.map(
      (employee) => employee.first_name + " " + employee.last_name
    );
    connection.query("SELECT * FROM role", function (error, results) {
      if (error) {
        throw error;
      }
      const roleArray = results.map((role) => role.title);
      const roleList = results;
      const changeQ = [
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employeeArray,
        },
        {
          type: "list",
          name: "role",
          message: "Which role would you like this employee to have?",
          choices: roleArray,
        },
      ];
      inquirer.prompt(changeQ).then((answer) => {
        const employeeMatch = employeeList.find((employee) => {
          const fullName = employee.first_name + " " + employee.last_name;
          return fullName === answer.employee;
        });
        const role = roleList.find((role) => role.title === answer.role);
        connection.query(
          `UPDATE employee SET role_id=${role.id} WHERE id =${employeeMatch.id}`,
          function (error, results) {
            if (error) {
              throw error;
            }
            startup();
          }
        );
      });
    });
  });
}
