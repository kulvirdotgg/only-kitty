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
	},
	port: 42069,
	error(error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	},
});
