import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env file manually
try {
	const envPath = path.join(__dirname, "../.env");
	const envFile = fs.readFileSync(envPath, "utf8");
	envFile.split("\n").forEach((line) => {
		const [key, ...valueParts] = line.split("=");
		if (key && valueParts.length > 0) {
			const value = valueParts.join("=").trim();
			process.env[key.trim()] = value;
		}
	});
} catch (error) {
	console.warn("Could not load .env file:", error);
}

const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !anon) {
	console.warn("Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_ANON_KEY.");
}
const supabase = createClient(url || "", anon || "");

app.get("/messages", async (_req, res) => {
	const { data, error } = await supabase
		.from("messages")
		.select("id,to,body,color,created_at")
		.order("created_at", { ascending: false });
	if (error) return res.status(500).json({ error: error.message });
	res.json(data ?? []);
});

app.post("/messages", async (req, res) => {
	const { to, body, color } = req.body || {};
	if (!to || !body) return res.status(400).json({ error: "Missing 'to' or 'body'" });
	const { data, error } = await supabase
		.from("messages")
		.insert({ to, body, color: color || "#f0f0f0" })
		.select("id,to,body,color,created_at")
		.single();
	if (error) return res.status(500).json({ error: error.message });
	res.status(201).json(data);
});

app.listen(PORT, () => {
	console.log(`Backend listening on http://localhost:${PORT}`);
});
