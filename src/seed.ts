import { db } from "./db";

function createTables() {
	db.run("PRAGMA foreign_keys = ON");

	db.run(`
		CREATE TABLE IF NOT EXISTS users (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			name TEXT,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
			)`);

	db.run(`
		CREATE TABLE IF NOT EXISTS customers (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
			customer_id TEXT NOT NULL UNIQUE,
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
			)`);

	db.run(`
		CREATE TABLE IF NOT EXISTS subscriptions (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
			stripe_customer_id INTEGER REFERENCES customers(id) ON DELETE SET NULL,
			stripe_session_id TEXT UNIQUE,
			plan_id TEXT NOT NULL DEFAULT "kitty_pics",
			amount_rupees INTEGER NOT NULL,
			status TEXT NOT NULL CHECK (
				status IN ('unpaid','paid','canceled')
			),
			created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
			updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
}

function main() {
	console.info("Creating tables in the database");
	createTables();
	console.info("Created tables in the database");

	const insertUserQuery = db.query(
		"INSERT INTO users (email, name) VALUES ($email, $name)",
	);

	insertUserQuery.run({
		$email: "meow@onlykitty.co",
		$name: "KittyQT",
	});
	const getUserQuery = db.query("SELECT * FROM users where id = $id");
	const user = getUserQuery.get({
		$id: 1,
	});
	console.info("[Inserted a user]\n", user);
}

main();
