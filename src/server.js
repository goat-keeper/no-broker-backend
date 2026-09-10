import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDatabase } from "./config/db.js";
import { ENV } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";

const app = express();
const port = ENV.PORT;

app.use(cors({ origin: ENV.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/api/health", (req, res) => {
	res.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRouter);

app.use((error, req, res, next) => {
	if (error.code === 11000) {
		const field = Object.keys(error.keyPattern)[0];
		return res.status(409).json({ message: `${field} already exists` });
	}

	if (error.name === "ValidationError") {
		return res.status(400).json({
			message: Object.values(error.errors).map(({ message }) => message),
		});
	}

	const statusCode = error.statusCode || 500;
	return res.status(statusCode).json({
		message: statusCode === 500 ? "Internal server error" : error.message,
	});
});

connectDatabase()
	.then(() => {
		app.listen(port, () => {
			console.log(`Server running on port ${port}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect to MongoDB", error.message);
		process.exit(1);
	});
