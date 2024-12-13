const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");

const app = express();
const port = 3050;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cars",
  password: "05350535",
  port: 5432,
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/cars", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cars");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving data from database");
  }
});

app.post("/api/cars", async (req, res) => {
  const { model, year, price, vin, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO cars (model, year, price, vin, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [model, year, price, vin, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding car to database");
  }
});

app.delete("/api/cars/:id", async (req, res) => {
  const carId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM cars WHERE car_id = $1 RETURNING *",
      [carId]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ message: "Car deleted successfully" });
    } else {
      res.status(404).json({ message: "Car not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting car from database");
  }
});

app.get("/api/customers", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving customers from database");
  }
});

app.post("/api/customers", async (req, res) => {
  const { first_name, last_name, phone, email, address } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (first_name, last_name, phone, email, address) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, phone, email, address]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding customer to database");
  }
});

app.delete("/api/customers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM customers WHERE customer_id = $1", [id]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting customer from database");
  }
});

app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM employees");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving employees from database");
  }
});

app.post("/api/employees", async (req, res) => {
  const { first_name, last_name, position, salary, hire_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO employees (first_name, last_name, position, salary, hire_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, position, salary, hire_date]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding employee to database");
  }
});

app.delete("/api/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM employees WHERE employee_id = $1", [id]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting employee from database");
  }
});

app.get("/api/order-services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM order_services");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving order services from database");
  }
});

app.post("/api/order-services", async (req, res) => {
  const { order_id, service_id, quantity, total_price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO order_services (order_id, service_id, quantity, total_price) VALUES ($1, $2, $3, $4) RETURNING *",
      [order_id, service_id, quantity, total_price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding order service to database");
  }
});

app.delete("/api/order-services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM order_services WHERE order_service_id = $1", [
      id,
    ]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting order service from database");
  }
});

// Маршрут для получения всех услуг
app.get("/api/services", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM services");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving services from database");
  }
});

app.post("/api/services", async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO services (name, description, price) VALUES ($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding service to database");
  }
});

app.delete("/api/services/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM services WHERE service_id = $1", [id]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting service from database");
  }
});
// Маршрут для получения всех заказов
app.get("/api/orders", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM orders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error retrieving orders from database");
  }
});

// Маршрут для добавления заказа
app.post("/api/orders", async (req, res) => {
  const { customer_id, car_id, employee_id, total_price, status } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO orders (customer_id, car_id, employee_id, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [customer_id, car_id, employee_id, total_price, status]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding order to database");
  }
});

app.delete("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM orders WHERE order_id = $1", [id]);
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting order from database");
  }
});

app.post("/reg", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required!" });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
      [name, email, hashed]
    );

    if (result.rows.length > 0) {
      const oneDay = 24 * 60 * 60 * 1000;
      res.cookie("email", email, { httpOnly: false, maxAge: oneDay });
      return res
        .status(201)
        .json({ success: "Admin registered successfully!" });
    } else {
      return res.status(500).json({ error: "Failed to register admin!" });
    }
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Email already exists!" });
    }
    console.error(err);
    return res.status(500).json({ error: "Internal server error!" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required!" });
  }

  try {
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found!" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password!" });
    }

    const oneDay = 24 * 60 * 60 * 1000;
    res.cookie("email", email, { httpOnly: false, maxAge: oneDay });
    res.status(200).json({ success: "Login successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
