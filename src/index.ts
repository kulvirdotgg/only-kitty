import { serve } from "bun";
serve({
	routes: {
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
