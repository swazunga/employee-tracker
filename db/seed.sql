USE company;

INSERT INTO department
    (name)
VALUES
    ("development"),
    ("accounting"),
    ("marketing");

INSERT INTO role
    (title, salary, department_id)
VALUES
    ("junior developer", 100000, 1),
    ("taxes", 80000, 2),
    ("mass marketer", 60000, 3);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ("Michael", "Kendrick", 1, NULL),
    ("Sarah", "Silver", 2, NULL),
    ("Bobby", "Digital", 3, NULL);