import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { request } from "supertest";
import app from "../src/app.js";
import { arrayBuffer } from "node:stream/consumers";

describe("Get /health", () => {
    test("returns 200 and status ok", async () => {
        const res = await request(app).get("/health");

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { status: "ok" });
    });
});

describe("POST /echo", () => {
    test("return the message when valid", async () => {
        const res = await request(app).post("/echo").send({ message: "hi" });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { message: "hi" });
    });

    test("returns 400 when message is missing", async () => {
        const res = await request(app).post("/echo").send({});

        assert.equal(res.status, 400);
        assert.deepEqual(res.body, { error: "message is required" });
    });

    test("returns 400 when message is not a string", async () => {
        const res = await request(app).post("/echo").send({ message: 8532409 });

        assert.equal(res.status, 400);
    });

    test("return 400 for broken json", async () => {
        const res = await request(app)
            .post("/echo")
            .set("Content-Type", "application/json")
            .send("{bad json}");

        assert.equal(res.status, 400);
        assert.deepEqual(typeof res.body.error, "string");
    });
});

describe("unknown routes", () => {
    test("returns 404", async () => {
        const res = await request(app).get("/nope");

        assert.equal(res.status, 404);
        assert.deepEqual(res.body, { error: "Not found" });
    });
});
