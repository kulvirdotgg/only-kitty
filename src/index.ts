import { serve } from "bun";
import Stripe from "stripe";

import landingPage from "./pages/index.html";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2025-08-27.basil",
});

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
		"/api/v1/checkout": async (_req) => {
			const session = await stripe.checkout.sessions.create({
				mode: "payment",
				line_items: [
					{
						price_data: {
							currency: "inr",
							unit_amount: 69 * 100, // (x * 100) cents = x dollars
							product_data: {
								name: "Kitty Sub",
								description: "meow meow meow",
							},
						},
						quantity: 1,
					},
				],
				success_url: "http://localhost:42069",
				cancel_url: "http://localhost:42069",
			});

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
		return new Response("Internal Server Error", { status: 500 });
	},
});
