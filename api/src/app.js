import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.post("/echo", (req, res) => {
    const { message } = req.body ?? {};
    if (typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "message is required" });
    }
    res.status(200).json({ message });
});

app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
    const status = err.status ?? 500;
    if (status === 500) console.error(err);
    res.status(status).json({
        error: status === 500 ? "Internal server error" : err.message,
    });
});

export default app;
