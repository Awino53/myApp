const express = require("express");
const app = express();
app.use(express.static("public")); //serve static
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const session = require("express-session");
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Authorization middleware
app.use((req, res, next) => {
    res.locals.user = req.session?.user;
    res.locals.isLoggedIn = req.session?.isLoggedIn || false;
  
    // If the user is not logged in and not accessing the signin page, redirect to login
    if (!req.session.isLoggedIn && req.path !== ["/signin", "/register", "/login"].includes(req.path)) {
      return res.render("login.ejs");
    }
    console.log('Middleware running');
    next();
  });
  

const bcrypt = require("bcrypt");
const salt = bcrypt.genSaltSync(3);

const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  database: "spendapp",
  user: "root",
  password: "",
});

// Route to migrate and hash passwords
app.get("/migrate-passwords", (req, res) => {
  // Step 1: Fetch users from the database
  const query = "SELECT user_id, password FROM users";
  db.query(query, (error, users) => {
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Error fetching users" });
    }

    const saltRounds = 10;

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
app.post("/register", (req, res) => {
    const { email, full_name, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
  
    const query = 'INSERT INTO users (email, full_name, password) VALUES (?, ?, ?)';
    const values = [email, full_name, hashedPassword];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting user:", err);
        return res.status(500).send("Database error");
      }
      console.log("User registered with ID:", result.insertId);
    res.redirect("/signin");
  });
});

// Route to render signin page
app.get("/signin", (req, res) => {
  res.render("signin.ejs");
});

// Login logic
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
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
        res.redirect("/home");
      } else {
        res.status(401).send("Invalid credentials");
      }
    });
  });
});

 
  app.get("/register", (req, res) => {
    res.render("register.ejs");
  });
    

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//signing in buttons
app.post("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/home", (req, res) => {
  res.render("home.ejs");
});

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

//page not found
app.get("*", (req, res) => {
  res.status(404).render("404.ejs");
});

//start
app.listen(3500, () => console.log("server running on port 3500"));
