const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const path = require("path");

const app = express(); // Initialize app first

app.use(express.static("public")); //serve static
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (form data)
app.use(express.json()); // For parsing application/json (if needed)

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true },
  })
);

// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  database: "spendapp",
  user: "root",
  password: "",
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL connected...");
});

// Authorization middleware
app.use((req, res, next) => {
  res.locals.user = req.session?.user;
  res.locals.isLoggedIn = req.session?.isLoggedIn || false;

  // If not logged in and trying to access a page other than sign in or login, redirect
  if (
    !res.locals.isLoggedIn &&
    req.path !== "/signin" &&
    req.path !== "/login" &&
    req.path !== "/"
  ) {
    return res.redirect("/"); // Redirect to the landing page if not logged in
  }
  next();
});

//hashing password
const saltRounds = 10;
const salt = bcrypt.genSaltSync(7);
// Route to migrate and hash passwords
app.get("/migrate-passwords", (req, res) => {
  // Step 1: Fetch users from the database
  const query = "SELECT user_id, password FROM users";
  db.query(query, (error, users) => {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }
    // Step 2: Process each user and hash their password
    let processedCount = 0;
    users.forEach((user) => {
      bcrypt.hash(user.password, saltRounds, (err, hashedPassword) => {
        if (err) {
          console.error(
            "Error hashing password for user_id:",
            user.user_id,
            err
          );
          return res.status(500).json({ message: "Error hashing passwords" });
        }
        // Update the password in the database
        const updateQuery =
          "UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?";
        db.query(
          updateQuery,
          [hashedPassword, user.user_id],
          (updateError, result) => {
            if (updateError) {
              console.error(
                "Error updating password for user_id:",
                user.user_id,
                updateError
              );
              return res
                .status(500)
                .json({ message: "Error updating passwords" });
            }

            processedCount++;
            console.log(`Updated password for user_id: ${user.user_id}`);

            // When all users are processed, send the response
            if (processedCount === users.length) {
              res
                .status(200)
                .json({ message: "Password migration and hashing complete." });
            }
          }
        );
      });
    });
  });
});

// Index route
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home"); // Redirect to home if logged in
  }
  res.render("index.ejs");
});

//signing in route
app.get("/signin", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home"); // Redirect to home if already logged in
  }
  res.render("signin.ejs");
});

// Register new user
app.post("/register", (req, res) => {
  const { email, full_name, password, confirmPassword } = req.body;

  // Validate that passwords match
  if (password !== confirmPassword) {
    return res
      .status(400)
      .render("register", { error: "Passwords do not match!" });
  }

  // Check if email already exists
  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).render("register", { error: "Database error" });
    }

    // If email already exists
    if (results.length > 0) {
      return res
        .status(400)
        .render("register", { error: "Email already in use" });
    }

    // Hash the password before storing
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("Error processing password:", err);
        return res
          .status(500)
          .render("register", { error: "Error processing password" });
      }

      // Insert the new user into the database
      const insertQuery =
        "INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)";
      db.query(
        insertQuery,
        [email, full_name, hashedPassword],
        (err, result) => {
          if (err) {
            console.error("Error inserting user:", err);
            return res
              .status(500)
              .render("register", { error: "Error inserting user" });
          }

          // Log the user in after successful registration
          req.session.user = { email };
          req.session.isLoggedIn = true;

          // Redirect to home page
          res.redirect("/home");
        }
      );
    });
  });
});

// Route to render the login page (sign in page)
app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home"); // Redirect to home if logged in
  }
  res.render("login.ejs", {
    // Render signin page with login error
    loginError: "Incorrect Credentials. Try again!!",
  });
});

// Login route - post request to authenticate user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Database error");
    }
    if (results.length === 0) {
      return res.status(401).send("User not found");
    }

    const user = results[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("Error comparing passwords:", err);
        return res.status(500).send("Error processing request");
      }
      if (isMatch) {
        req.session.user = { id: user.user_id, email: user.email };
        req.session.isLoggedIn = true;
        res.redirect("/home"); // Redirect to home after successful login
      } else {
        res.status(401).send("Authentication failed");
      }
    });
  });
});

// Optionally, render login page when GET request is made to /login
app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home"); // If already logged in, redirect to home
  }
  res.render("signin.ejs", { loginError: null }); // Show login page with no error initially
});

/* home page */

app.get("/home", (req, res) => {
  const userId = 1; // Replace with the session user ID

  // Query categories
  db.query(
    "SELECT * FROM categories WHERE user_id IS NULL OR user_id = ?",
    [userId],
    (error, categories) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .send("Error loading categories: " + error.message);
      }

      // Query income data
      db.query(
        `SELECT income.*, categories.name AS category_name 
        FROM income 
        LEFT JOIN categories ON income.category_id = categories.category_id`,
        (error, income) => {
          if (error) {
            console.log(error);
            return res
              .status(500)
              .send("Error loading income data: " + error.message);
          }

          // Query total income
          db.query(
            "SELECT SUM(amount) AS total FROM income WHERE user_id = ?",
            [userId],
            (error, totalIncome) => {
              if (error) {
                console.log(error);
                return res
                  .status(500)
                  .send("Error calculating total income: " + error.message);
              }

              // Query income by category
              db.query(
                `SELECT categories.name AS category_name, SUM(income.amount) AS total
                FROM income
                LEFT JOIN categories ON income.category_id = categories.category_id
                WHERE income.user_id = ?
                GROUP BY income.category_id`,
                [userId],
                (error, incomeByCategory) => {
                  if (error) {
                    console.log(error);
                    return res
                      .status(500)
                      .send(
                        "Error calculating income by category: " + error.message
                      );
                  }

                  // Query expenses data
                  db.query(
                    `SELECT expenses.*, categories.name AS category_name 
                    FROM expenses 
                    LEFT JOIN categories ON expenses.category_id = categories.category_id`,
                    (error, expenses) => {
                      if (error) {
                        console.log(error);
                        return res
                          .status(500)
                          .send(
                            "Error loading expenses data: " + error.message
                          );
                      }

                      // Query total expenses
                      db.query(
                        "SELECT SUM(amount) AS total FROM expenses WHERE user_id = ?",
                        [userId],
                        (error, totalExpenses) => {
                          if (error) {
                            console.log(error);
                            return res
                              .status(500)
                              .send(
                                "Error calculating total expenses: " +
                                  error.message
                              );
                          }

                          // Query expenses by category
                          db.query(
                            `SELECT categories.name AS category_name, SUM(expenses.amount) AS total
                            FROM expenses
                            LEFT JOIN categories ON expenses.category_id = categories.category_id
                            WHERE expenses.user_id = ?
                            GROUP BY expenses.category_id`,
                            [userId],
                            (error, expensesByCategory) => {
                              if (error) {
                                console.log(error);
                                return res
                                  .status(500)
                                  .send(
                                    "Error calculating expenses by category: " +
                                      error.message
                                  );
                              }

                              /* to be tested */

                              /* for tarcking budget */

                              /* app.get("/budget-status/:user_id", (req, res) => {
                                const userId = req.params.user_id; */

                                // Get all budgets for the user
                                db.query(
                                  `SELECT * FROM budget WHERE user_id = ?`,
                                  [userId],
                                  (err, budgets) => {
                                    if (err) {
                                      return res
                                        .status(500)
                                        .json({
                                          status: "error",
                                          message: err.message,
                                        });
                                    }
                                    function checkBudgetsAndNotify(
                                      budgets,
                                      userId,
                                      sendNotification
                                    ) {
                                      budgets.forEach((budget) => {
                                        if (budget.remaining < 0) {
                                          sendNotification(
                                            userId,
                                            `You are over budget for ${budget.name}!`,
                                            (err) => {
                                              if (err) {
                                                console.error(
                                                  `Failed to send notification for budget ${budget.name}:`,
                                                  err.message
                                                );
                                              } else {
                                                console.log(
                                                  `Notification sent for budget ${budget.name}`
                                                );
                                              }
                                            }
                                          );
                                        }
                                      });
                                    }
                                    // Get total income
                                    db.query(
                                      `SELECT SUM(amount) as total_income FROM income WHERE user_id = ?`,
                                      [userId],
                                      (err, incomeResult) => {
                                        if (err) {
                                          return res
                                            .status(500)
                                            .json({
                                              status: "error",
                                              message: err.message,
                                            });
                                        }

                                        const totalIncome =
                                          (incomeResult[0] &&
                                            incomeResult[0].total_income) ||
                                          0;

                                        // Get total expenses
                                        db.query(
                                          `SELECT SUM(amount) as total_expenses FROM expenses WHERE user_id = ?`,
                                          [userId],
                                          (err, expenseResult) => {
                                            if (err) {
                                              return res
                                                .status(500)
                                                .json({
                                                  status: "error",
                                                  message: err.message,
                                                });
                                            }

                                            const totalExpenses =
                                              (expenseResult[0] &&
                                                expenseResult[0]
                                                  .total_expenses) ||
                                              0;

                                            const results = budgets.map(
                                              (budget) => {
                                                const remaining =
                                                  totalIncome -
                                                  totalExpenses -
                                                  budget.amount;

                                                return {
                                                  ...budget,
                                                  remaining,
                                                  status:
                                                    remaining < 0
                                                      ? "Over Budget"
                                                      : "Under Budget",
                                                  color:
                                                    remaining < 0
                                                      ? "red"
                                                      : "green",
                                                };
                                              }
                                            );

                                           /*  res.render("home", {
                                              status: "success",
                                              data: results,
                                            }); */
                                          }
                                        );
                                      }
                                    );
                                  }
                                );
                              /* }); */

                              /* for notifications */
                              const sendNotification = (userId, message, callback) => { 
                                // Ensure db is properly connected and initialized before calling this
                                db.query(
                                  `INSERT INTO notifications (user_id, message, created_at) VALUES (?, ?, NOW())`,
                                  [userId, message],  // Prevent SQL injection by using parameterized queries
                                  (err, result) => {
                                    if (callback) {
                                      callback(err, result);  // Calls the callback with error or result
                                    } else {
                                      // Optionally handle the case where no callback is passed (e.g., logging)
                                      if (err) {
                                        console.error('Error inserting notification:', err);
                                      } else {
                                        console.log('Notification inserted:', result);
                                      }
                                    }
                                  }
                                );
                              };
                              

                              /* app.get("/notifications/:user_id", (req, res) => {
                                const userId = req.params.user_id; */

                                db.query(
                                  `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`,
                                  [userId],
                                  (err, notifications) => {
                                    if (err) {
                                      return res
                                        .status(500)
                                        .json({
                                          status: "error",
                                          message: err.message,
                                        });
                                    }

                                    /* res.render("home", {
                                      status: "success",
                                      data: notifications,
                                    }); */
                                  }
                                );
                              /* }); */

                              // Render home.ejs with all the data
                              res.render("home", {
                                categories,
                                income,
                                totalIncome: totalIncome[0].total || 0,
                                incomeByCategory,
                                expenses,
                                totalExpenses: totalExpenses[0].total || 0,
                                expensesByCategory,
 
                                budgets,
                                incomeResult,
                                expenseResult,
                                result,
                                sendNotification,
                  
                                  
                              });
                            }
                          );
                        }
                      );
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});

// Categories
app.post("/categories/add", (req, res) => {
  const { type, name, description } = req.body;
  const userId = 1; // Replace with session user ID

  db.query(
    `INSERT INTO categories (type, name, description, user_id) VALUES (?, ?, ?, ?)`,
    [type, name, description, userId],
    (error) => {
      if (error)
        return res.status(500).send("Error adding category: " + error.message);
      res.redirect("/home");
    }
  );
});

app.post("/categories/delete/:id", (req, res) => {
  const categoryId = req.params.id;

  db.query(
    `DELETE FROM categories WHERE category_id = ?`,
    [categoryId],
    (error) => {
      if (error)
        return res
          .status(500)
          .send("Error deleting category: " + error.message);
      res.redirect("/home");
    }
  );
});

// Income
app.post("/income/add", (req, res) => {
  const { type, amount, period, date, category_id } = req.body;
  const userId = 1; // Replace with session user ID

  db.query(
    `INSERT INTO income (type, amount, period, date, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, amount, period, date, category_id, userId],
    (error) => {
      if (error)
        return res.status(500).send("Error adding income: " + error.message);
      res.redirect("/home");
    }
  );
});

// Expenses
app.post("/expenses/add", (req, res) => {
  const { type, amount, description, date, category_id } = req.body;
  const userId = 1; // Replace with session user ID

  db.query(
    `INSERT INTO expenses (type, amount, description, date, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)`,
    [type, amount, description, date, category_id, userId],
    (error) => {
      if (error)
        return res.status(500).send("Error adding expense: " + error.message);
      res.redirect("/home");
    }
  );
});

//aditional routes
app.get("/wallet", (req, res) => {
  res.render("wallet.ejs");
});

app.get("/reports", (req, res) => {
  res.render("reports.ejs");
});
app.get("/profile", (req, res) => {
  res.render("profile.ejs");
});
//this is target space
// Fetch all goals for the logged-in user
app.get("/targets", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signin");
  }

  const userId = req.session.user.id; // Assuming the session contains user details
  const query = "SELECT * FROM saving_goals WHERE user_id = ?";

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching goals:", err);
      return res.status(500).send("Database error");
    }
    res.render("targets", { goals: results }); // Render the goals page with data
  });
});

// Add a new goal for the logged-in user
app.post("/add-goal", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signin");
  }

  const { name, target_amount } = req.body;
  const userId = req.session.user.id;
  const query =
    "INSERT INTO saving_goals (user_id, name, target_amount, saved_amount, period, created_at) VALUES (?, ?, ?, 0, NULL, NOW())";

  db.query(query, [userId, name, target_amount], (err, results) => {
    if (err) {
      console.error("Error adding goal:", err);
      return res.status(500).send("Database error");
    }
    res.redirect("/targets");
  });
});

// Update an existing goal's saved amount
app.post("/update-goal", (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/signin");
  }

  const { goal_id, saved_amount } = req.body;
  const query = "UPDATE saving_goals SET saved_amount = ? WHERE goal_id = ?";

  db.query(query, [saved_amount, goal_id], (err, results) => {
    if (err) {
      console.error("Error updating goal:", err);
      return res.status(500).send("Database error");
    }
    res.redirect("/targets");
  });
});

//footer landing page
app.get("/terms", (req, res) => {
  res.render("terms.ejs");
});
app.get("/policy", (req, res) => {
  res.render("policy.ejs");
});
app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});
app.get("/faqs", (req, res) => {
  res.render("faqs.ejs");
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).render("500.ejs");
    res.redirect("/");
  });
});

//page not found
app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});

//start
app.listen(3500, () => console.log("server running on port 3500"));
