// Supabase Edge Function for message moderation using HuggingFace Inference API

// @ts-ignore - Deno is available at runtime in Supabase Edge Functions
Deno.serve(async (req) => {
    const TOXICITY_THRESHOLD = 0.7; // Toxicity threshold
    
    // Get the text from the request body
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

		// Check if any toxicity label exceeds threshold
		const isToxic = scores.some((r: any) => r.score > TOXICITY_THRESHOLD);

		// Check for severe toxicity specifically
		const severeToxic = scores.find((r: any) => r.label === "severe_toxic");
		const isSevere = severeToxic?.score > 0.5;

		// Check for moderate toxicity (toxic score between 0.5 and 0.7)
		const toxicScore = scores.find((r: any) => r.label === "toxic")?.score || 0;
		const isModerate = toxicScore >= 0.5 && toxicScore <= 0.7;

		// Flag messages that are either moderate or severe
		const shouldFlag = isModerate || isSevere;

		return new Response(
			JSON.stringify({
				text,
				scores: scores,
				toxic: isToxic,
				severe: shouldFlag, // Flag if moderate or severe
				moderate: isModerate,
				severeToxic: isSevere,
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

