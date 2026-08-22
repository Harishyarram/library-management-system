import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import authMiddleware from "./middleware/authMiddleware.js";
import db from "./db.js";

dotenv.config();

const app = express();

const PORT = 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);  

app.use(express.json());

// ===============================
// HOME
// ===============================

app.get("/", (req, res) => {
  res.send("Library Management System Backend is working!");
});

// ===============================
// TEST DATABASE
// ===============================

app.get("/api/test-db", (req, res) => {
  db.query("SELECT DATABASE() AS databaseName", (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results[0]);
  });
});

// ===============================
// SIGNUP
// ===============================

app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    // Check if email already exists
    const checkSql = "SELECT * FROM users WHERE email = ?";

    db.query(checkSql, [email], async (err, results) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql = `
          INSERT INTO users
          (name, email, password, role)
          VALUES (?, ?, ?, ?)
        `;

      db.query(sql, [name, email, hashedPassword, "student"], (err, result) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Unable to create account",
          });
        }

        res.status(201).json({
          message: "Account created successfully",
          userId: result.insertId,
        });
      });
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

// ===============================
// LOGIN
// ===============================

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required",
    });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = results[0];

    try {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Create JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.json({
        message: "Login successful",

        token: token,

        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Login failed",
      });
    }
  });
});

// ===============================
// GET BOOKS
// ===============================

app.get("/api/books", (req, res) => {
  const sql = "SELECT * FROM books";

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

// ===============================
// ADD BOOK
// ===============================

app.post("/api/books", (req, res) => {
  const { title, author, isbn, category, total_quantity, is_reference } =
    req.body;

  if (!title || !author || !total_quantity) {
    return res.status(400).json({
      message: "Title, author and quantity are required",
    });
  }

  const sql = `
    INSERT INTO books
    (
      title,
      author,
      isbn,
      category,
      total_quantity,
      available_quantity,
      is_reference
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      author,
      isbn || null,
      category || null,
      total_quantity,
      total_quantity,
      is_reference || false,
    ],
    (err, result) => {
      if (err) {
        console.log(err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "ISBN already exists",
          });
        }

        return res.status(500).json({
          message: "Database error",
        });
      }

      res.status(201).json({
        message: "Book added successfully",
        bookId: result.insertId,
      });
    },
  );
});

// ===============================
// DASHBOARD
// ===============================
app.get("/api/dashboard", authMiddleware, (req, res) => {
  console.log("DASHBOARD API CALLED");

  const queries = {
    totalBooks: `
        SELECT COALESCE(
          SUM(total_quantity), 0
        ) AS count
        FROM books
      `,

    availableBooks: `
        SELECT COALESCE(
          SUM(available_quantity), 0
        ) AS count
        FROM books
      `,

    issuedBooks: `
        SELECT COUNT(*) AS count
        FROM book_issues
        WHERE status = 'issued'
      `,

    returnedBooks: `
        SELECT COUNT(*) AS count
        FROM book_issues
        WHERE status = 'returned'
      `,

    referenceBooks: `
        SELECT COALESCE(
          SUM(total_quantity), 0
        ) AS count
        FROM books
        WHERE is_reference = TRUE
      `,

    payments: `
        SELECT COALESCE(
          SUM(amount), 0
        ) AS total
        FROM payments
        WHERE payment_status = 'paid'
      `,
  };

  db.query(queries.totalBooks, (err, totalResult) => {
    if (err) {
      console.log("TOTAL BOOKS ERROR:", err);

      return res.status(500).json({
        message: "Total books query failed",
        error: err.message,
      });
    }

    db.query(queries.availableBooks, (err, availableResult) => {
      if (err) {
        console.log("AVAILABLE BOOKS ERROR:", err);

        return res.status(500).json({
          message: "Available books query failed",
          error: err.message,
        });
      }

      db.query(queries.issuedBooks, (err, issuedResult) => {
        if (err) {
          console.log("ISSUED BOOKS ERROR:", err);

          return res.status(500).json({
            message: "Issued books query failed",
            error: err.message,
          });
        }

        db.query(queries.returnedBooks, (err, returnedResult) => {
          if (err) {
            console.log("RETURNED BOOKS ERROR:", err);

            return res.status(500).json({
              message: "Returned books query failed",
              error: err.message,
            });
          }

          db.query(queries.referenceBooks, (err, referenceResult) => {
            if (err) {
              console.log("REFERENCE BOOKS ERROR:", err);

              return res.status(500).json({
                message: "Reference books query failed",
                error: err.message,
              });
            }

            db.query(queries.payments, (err, paymentResult) => {
              if (err) {
                console.log("PAYMENTS ERROR:", err);

                return res.status(500).json({
                  message: "Payments query failed",
                  error: err.message,
                });
              }

              res.json({
                totalBooks: totalResult[0].count,

                availableBooks: availableResult[0].count,

                issuedBooks: issuedResult[0].count,

                returnedBooks: returnedResult[0].count,

                referenceBooks: referenceResult[0].count,

                payments: paymentResult[0].total,
              });
            });
          });
        });
      });
    });
  });
});
// ===============================
// START SERVER
// ===============================
app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    message: "Authenticated",
    user: req.user,
  });
});
app.post("/api/books/issue", authMiddleware, (req, res) => {
  const { bookId, dueDate } = req.body;
  const userId = req.user.id;

  if (!bookId || !dueDate) {
    return res.status(400).json({
      message: "Book and due date are required",
    });
  }

  const checkBookSql = `
      SELECT *
      FROM books
      WHERE id = ?
    `;

  db.query(checkBookSql, [bookId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const book = results[0];

    if (book.is_reference) {
      return res.status(400).json({
        message: "Reference books cannot be issued",
      });
    }

    if (book.available_quantity <= 0) {
      return res.status(400).json({
        message: "Book is not available",
      });
    }

    const checkExistingSql = `
          SELECT id
          FROM book_issues
          WHERE user_id = ?
            AND book_id = ?
            AND status = 'issued'
        `;

    db.query(checkExistingSql, [userId, bookId], (err, existingResults) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Database error",
        });
      }

      if (existingResults.length > 0) {
        return res.status(400).json({
          message: "You already have this book issued",
        });
      }

      const insertIssueSql = `
              INSERT INTO book_issues
              (
                user_id,
                book_id,
                issue_date,
                due_date,
                status
              )
              VALUES
              (?, ?, CURDATE(), ?, 'issued')
            `;

      db.query(insertIssueSql, [userId, bookId, dueDate], (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Unable to issue book",
          });
        }

        const updateBookSql = `
                  UPDATE books
                  SET available_quantity =
                    available_quantity - 1
                  WHERE id = ?
                `;

        db.query(updateBookSql, [bookId], (err) => {
          if (err) {
            console.log(err);

            return res.status(500).json({
              message: "Book issued but quantity update failed",
            });
          }

          res.json({
            message: "Book issued successfully",
          });
        });
      });
    });
  });
});

app.get("/api/my-issued-books", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
      SELECT
        bi.id,
        b.title,
        bi.issue_date,
        bi.due_date,
        bi.status
      FROM book_issues bi
      JOIN books b
        ON bi.book_id = b.id
      WHERE bi.user_id = ?
        AND bi.status = 'issued'
      ORDER BY bi.issue_date DESC
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

app.post("/api/books/return/:issueId", authMiddleware, (req, res) => {
  const issueId = req.params.issueId;
  const userId = req.user.id;

  const findIssueSql = `
      SELECT *
      FROM book_issues
      WHERE id = ?
        AND user_id = ?
        AND status = 'issued'
    `;

  db.query(findIssueSql, [issueId, userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Issued book not found",
      });
    }

    const issue = results[0];

    const updateIssueSql = `
          UPDATE book_issues
          SET status = 'returned'
          WHERE id = ?
        `;

    db.query(updateIssueSql, [issueId], (err) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          message: "Unable to return book",
        });
      }

      const updateBookSql = `
              UPDATE books
              SET available_quantity =
                available_quantity + 1
              WHERE id = ?
            `;

      db.query(updateBookSql, [issue.book_id], (err) => {
        if (err) {
          console.log(err);

          return res.status(500).json({
            message: "Book returned but quantity update failed",
          });
        }

        res.json({
          message: "Book returned successfully",
        });
      });
    });
  });
});

app.get("/api/reference-books", (req, res) => {
  const sql = `
    SELECT
      id,
      title,
      author,
      isbn,
      category,
      total_quantity
    FROM books
    WHERE is_reference = TRUE
    ORDER BY title
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

app.get("/api/my-payments", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
      SELECT
        p.id,
        b.title,
        p.amount,
        p.payment_date,
        p.payment_status
      FROM payments p
      JOIN book_issues bi
        ON p.issue_id = bi.id
      JOIN books b
        ON bi.book_id = b.id
      WHERE p.user_id = ?
      ORDER BY p.payment_date DESC
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

app.get("/api/my-book-history", authMiddleware, (req, res) => {
  const userId = req.user.id;

  const sql = `
      SELECT
        bi.id,
        b.title,
        bi.issue_date,
        bi.due_date,
        bi.status
      FROM book_issues bi
      JOIN books b
        ON bi.book_id = b.id
      WHERE bi.user_id = ?
      ORDER BY bi.issue_date DESC
    `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.log(err);

      return res.status(500).json({
        message: "Database error",
      });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
