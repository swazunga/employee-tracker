DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS employee;

CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR
(30)
);

CREATE TABLE role
(
    id INTEGER
    AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR
    (30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY
    (department_id) REFERENCES department
    (id)
);

    CREATE TABLE employee
    (
        id INTEGER
        AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR
        (30) NOT NULL,
    last_name VARCHAR
        (30) NOT NULL,
    role_id INTEGER NOT NULL,
    FOREIGN KEY
        (role_id) REFERENCES role
        (id),
        salary INTEGER NOT NULL,
        FOREIGN KEY
        (salary) REFERENCES role
        (salary),
    manager_id INTEGER,
    FOREIGN KEY
        (manager_id) REFERENCES employee
        (id)
);