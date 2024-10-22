 -- 1. Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Income Table
CREATE TABLE income (
    income_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL,  -- e.g., salary, investment, freelance, side gigs, family and friends.
    amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20) NOT NULL, -- e.g., daily, weekly, monthly, annually
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 3. Expenses Table
CREATE TABLE expenses (
    expense_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    type VARCHAR(50) NOT NULL,  -- e.g., groceries, bills and utilities, transport, school fees, kids, family and friends,food and shopping, investments, personal upkeep,health and fitness.
    amount DECIMAL(10, 2) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 4. Savings Table
CREATE TABLE savings (
    savings_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    goal_id INT,
    type VARCHAR(50) NOT NULL,  -- e.g., short-term, long-term, emergency fund, business funds
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (goal_id) REFERENCES saving_goals(goal_id)
);

-- 5. Saving Goals Table
CREATE TABLE saving_goals (
    goal_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    target_amount DECIMAL(10, 2),
    period VARCHAR(20), -- e.g., daily, weekly, monthly, 6 months, 1 year
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 6. Budget Table
CREATE TABLE budget (
    budget_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20), -- e.g., weekly, monthly, annually
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 7. Debts and loan Table
CREATE TABLE debts (
    debt_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    balance DECIMAL(10, 2) NOT NULL,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    interest_rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- 8. Debt Payments Table
CREATE TABLE debt_payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    debt_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (debt_id) REFERENCES debts(debt_id)
);

-- 9. Bills Table
CREATE TABLE bills (
    bill_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    recurring BOOLEAN DEFAULT FALSE, -- Indicates if the bill is recurring (e.g., rent, utilities)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);



/* Relationships:
Users have many income, expenses, savings, budgets, debts, and bills.
Debts can have many debt payments.
Savings belong to specific saving goals.
Next Steps:
Set Up the Database: Use these SQL scripts to create your tables in a database (e.g., PostgreSQL, MySQL).
Write CRUD Operations: You’ll need to implement Create, Read, Update, and Delete (CRUD) operations in your code.
Connect Your App to the Database: Depending on the backend stack you use (Node.js, Django, etc.), connect to your SQL database to perform operations on the data. */