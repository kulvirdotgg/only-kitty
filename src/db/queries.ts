import { db } from "./index";

export const queries = {
	createUser: db.query(
		"INSERT INTO users (email, name) VALUES ($email, $name)",
	),
	getUserbyId: db.query("SELECT * FROM users WHERE id = $id"),

	createCustomer: db.query(
		"INSERT INTO customers (customer_id, user_id) VALUES ($customer_id, $user_id)",
	),
	getCustomerByUserId: db.query(
		"SELECT * FROM customers WHERE user_id = $user_id",
	),
	createSubscription: db.query(
		"INSERT INTO subscriptions (user_id, stripe_customer_id, stripe_session_id, amount_rupees, status)\
		VALUES ($user_id, $stripe_customer_id, $stripe_session_id, $amount_rupees, $status)",
	),
};
