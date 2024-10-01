CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,---awino
    email VARCHAR(255) UNIQUE NOT NULL,---estherojul53@gmail.com
    full_name VARCHAR(255) NOT NULL,---esther awino
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,---24/9/1999
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE income (
    income_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),--awino
    type VARCHAR(50) NOT NULL,  -- e.g., salary, investment,freelance and side gigs, family and friends
    amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20) NOT NULL, -- e.g.,daily,weekly, monthly, annually
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE expenses (
    expense_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    type VARCHAR(50) NOT NULL,  -- e.g., groceries,bills, transport, family and friends, shoppings,investments, personal treats.
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE savings (
    savings_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    goal_id INT REFERENCES saving_goals(goal_id),
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE saving_goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10, 2),
    period VARCHAR(20), -- e.g.,daily, weekly, monthly, 6 months, 1 year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE budget (
    budget_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20), -- e.g., monthly, annually
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE debts (
    debt_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE debt_payments (
    payment_id SERIAL PRIMARY KEY,
    debt_id INT REFERENCES debts(debt_id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE bills (
    bill_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    recurring BOOLEAN DEFAULT FALSE, -- Indicates if the bill is recurring
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* Relationships:
Users have many income, expenses, savings, budgets, debts, and bills.
Debts can have many debt payments.
Savings belong to specific saving goals.
Next Steps:
Set Up the Database: Use these SQL scripts to create your tables in a database (e.g., PostgreSQL, MySQL).
Write CRUD Operations: You’ll need to implement Create, Read, Update, and Delete (CRUD) operations in your code.
Connect Your App to the Database: Depending on the backend stack you use (Node.js, Django, etc.), connect to your SQL database to perform operations on the data. */