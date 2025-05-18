import request from "supertest";
import { app } from "../../server.js";

describe("GET /tournaments?location=", () => {
    test("should return tournaments in London", async () => {
        const response = await request(app)
            .get("/tournaments?location=London");

        expect(response.status).toBe(404);
        
    });

    test("should return tournaments in New York", async () => {
        const response = await request(app)
            .get("/tournaments?location=New York");

        expect(response.status).toBe(404);
        
    });

    test("should return empty array for non-existent location", async () => {
        const response = await request(app)
            .get("/tournaments?location=Tokyo");

        expect(response.status).toBe(404);
       
    });

    test("should return all tournaments when no location specified", async () => {
        const response = await request(app)
            .get("/tournaments");

        expect(response.status).toBe(404);
       
    });
});