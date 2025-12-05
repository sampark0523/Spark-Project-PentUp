// Supabase Edge Function for message moderation using HuggingFace Inference API

// @ts-ignore - Deno is available at runtime in Supabase Edge Functions
Deno.serve(async (req) => {
	try {
		const { text } = await req.json();

		if (!text) {
			return new Response(
				JSON.stringify({ error: "Missing 'text' field" }),
				{
					status: 400,
					headers: { "Content-Type": "application/json" },
				}
			);
		}

		// Get API key from environment variables
		// @ts-ignore
		const HF_API_KEY = Deno.env.get("HF_API_KEY");

		if (!HF_API_KEY) {
			throw new Error("HF_API_KEY not found.");
		}

		// HuggingFace API endpoint to detoxify model
		const apiUrl = "https://router.huggingface.co/hf-inference/models/unitary/toxic-bert";

		const response = await fetch(apiUrl, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${HF_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ inputs: text }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HuggingFace API error: ${response.status} ${response.statusText} - ${errorText}`);
		}

		const result = await response.json();

		// Handle both old format (array) and new format (nested array)
		let scores: any[] = [];
		
		if (Array.isArray(result)) {
			// Check if it's nested (new router format)
			if (result.length > 0 && Array.isArray(result[0])) {
				// Flatten nested array
				scores = result[0];
			} else {
				// Direct array format
				scores = result;
			}
		} else if (result && Array.isArray(result[0])) {
			// Another nested format
			scores = result[0];
		} else {
			scores = result;
		}

		// Get the toxic score
		const toxicScore = scores.find((r: any) => r.label === "toxic")?.score || 0;

		// Flag messages if toxicity score is over 0.9
		const shouldFlag = toxicScore > 0.9;

		return new Response(
			JSON.stringify({
				text,
				scores: scores,
				severe: shouldFlag,
				toxicityScore: toxicScore,
			}),
			{
				status: 200,
				headers: { "Content-Type": "application/json" },
			}
		);
	} catch (err) {
		console.error("Error in moderate-message function:", err);
		return new Response(
			JSON.stringify({ error: err.toString() }),
			{
				status: 500,
				headers: { "Content-Type": "application/json" },
			}
		);
	}
});

