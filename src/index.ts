import { serve } from "bun";
import Stripe from "stripe";

import landingPage from "./pages/index.html";
import { queries } from "./db/queries";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;
const BASE_URL = process.env.BASE_URL!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
});

const SUCCESS_URL = `${BASE_URL}/api/v1/success?sessionId={CHECKOUT_SESSION_ID}`;
const CANCEL_URL = `${BASE_URL}/api/v1/cancel`;

serve({
	routes: {
		"/": landingPage,
		"/api/v1/meow": {
			GET: () => {
				const message = "Hello kitty";
				return Response.json({
					success: true,
					message,
				});
			},
		},
		"/api/v1/checkout": async (req) => {
			const { id } = await req.body?.json();

			// user-auth (usually happens in middleware)
			const user: any = queries.getUserbyId.get({
				$id: id,
			});
			if (!user) {
				return Response.json({ success: false }, 401);
			}
			console.info(user);

			// stripe customer_id
			const stripeCustomer = queries.getCustomerByUserId.get({
				$user_id: user.id,
			});
			let customerId = (stripeCustomer as any).customer_id;

			if (!customerId) {
				// if striper customer does not exist (if user is making first time payment)
				// create a new stripe customer
				const newCustomer = await stripe.customers.create({
					email: user.email,
					metadata: {
						userId: user.id,
					},
				});
				console.info("newly created stripe customer: %o", newCustomer);

				// store the relation b/w user_id and customer_id in DB
				// preferably a KV store
				queries.createCustomer.run({
					$customer_id: newCustomer.id,
					$user_id: user.id,
				});
				customerId = newCustomer.id;
			}

			console.info("stripe customer Id: [%s]", customerId);

			const session = await stripe.checkout.sessions.create({
				customer: customerId, // autofills the customer details for existing customers
				mode: "payment",
				currency: "inr",
				line_items: [
					{
						price_data: {
							currency: "inr",
							unit_amount: 69 * 100, // (x * 100) paise = x rs
							product_data: {
								name: "Kitty Sub",
								description: "meow meow meow meow",
							},
						},
						quantity: 1,
					},
				],
				metadata: {
					productId: "kitty-42069", // product id for which user is making a purchase
					userId: user.id,
				},
				success_url: SUCCESS_URL,
				cancel_url: CANCEL_URL,
			});

			console.info("stripe session\n", session);

			const redirectUrl = session.url;
			if (!redirectUrl) {
				throw new Error("Stripe checkout session url not present");
			}

			return Response.redirect(redirectUrl, 302);
		},
	},
	port: 42069,
	error(error) {
		console.error(error);
		return Response.json(
			{
				success: false,
				message: "Internal Server Error",
			},
			500,
		);
	},
});
