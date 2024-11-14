const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const bcrypt = require("bcrypt");
const mysql = require("mysql");

const app = express();
app.use(express.static("public")); //serve static
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded (form data)
app.use(express.json()); // For parsing application/json (if needed)

 

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);

// Authorization middleware
// Authorization middleware
app.use((req, res, next) => {
  res.locals.user = req.session?.user;
  res.locals.isLoggedIn = req.session?.isLoggedIn || false;

  // If not logged in and trying to access a page other than sign in or login, redirect
  if (!res.locals.isLoggedIn && req.path !== "/signin" && req.path !== "/login" && req.path !== "/") {
    return res.redirect("/index");  // Redirect to the landing page if not logged in
  }
  next();
});


// Connect to database
const db = mysql.createConnection({
  host: "localhost",
  database: "spendapp",
  user: "root",
  password: "",
});

//hashing password

const saltRounds = 10;
const salt = bcrypt.genSaltSync(3);
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

//register new user
// Registration route
app.post("/register", (req, res) => {
  const { email, full_name, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const query =
    "INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)";
  const values = [email, full_name, hashedPassword];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      return res.status(500).send("Database error");
    }

    req.session.user = { id: result.insertId, email };
    req.session.isLoggedIn = true;

    console.log("Session after registration:", req.session); // Debugging session

    // Redirect to home if login is successful and session is set
    if (req.session.isLoggedIn) {
      return res.redirect("/home");
    } else {
      return res.redirect("/index"); // Fallback redirect
    }
  });
});

// Login logic
// Login route
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
        res.redirect("/home"); // Redirect to home after login
      } else {
        res.status(401).send("Invalid credentials");
      }
    });
  });
});

// Index route
app.get("/", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home");
  }
  res.render("index.ejs");
});

// Home route (protected)
app.get("/home", (req, res) => {
  if (req.session.isLoggedIn) {
    res.render("home"); // Render home page for logged-in users
  } else {
    console.log("Not logged in. Redirecting to signin.");
    res.redirect("/signin"); // Redirect to signin if not logged in
  }
});

//signing in route
app.get("/signin", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/home"); // Redirect to home if already logged in
  }
  res.render("signin.ejs");
});

// Route to render the login page
app.get("/login", (req, res) => {
  res.render("login.ejs"); // This should render the login page where users can input their credentials
});

//aditional routes
app.get("/categories", (req, res) => {
  res.render("categories.ejs");
});
app.get("/targets", (req, res) => {
  res.render("targets.ejs");
});
app.get("/reports", (req, res) => {
  res.render("reports.ejs");
});
app.get("/profile", (req, res) => {
  res.render("profile.ejs");
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

//edited expenses are getting managed from this end
// Edit expense endpoint
app.post("/expenses/edit/:expense_id", (req, res) => {
  const expenseId = req.params.expense_id;
  const { type, amount, description, date } = req.body;

  const query = `
    UPDATE expenses 
    SET type = ?, amount = ?, description = ?, date = ?
    WHERE expense_id = ?`;

  db.query(
    query,
    [type, amount, description, date, expenseId],
    (err, result) => {
      if (err) {
        console.error("Error updating expense:", err);
        return res.status(500).send("Database error");
      }
      res.send("Expense updated successfully");
    }
  );
});

app.get("/daily-expenses", (req, res) => {
  const userId = req.session.user.id;

  const query = "SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC";
  db.query(query, [userId], (err, expenses) => {
    if (err) {
      console.error("Error retrieving expenses:", err);
      return res.status(500).send("Database error");
    }
    res.render("daily-expenses.ejs", { expenses });
  });
});

//page not found
app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});

//start
app.listen(3500, () => console.log("server running on port 3500"));
