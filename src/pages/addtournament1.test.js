import request from "supertest";
import { app } from "../../server.js";

describe("POST /api/tournaments", () => {
    beforeEach(() => {
        
      
    });

    test("should add a new tournament", async () => {
        const newTournament = {
            name: "Australian Open",
            location: "Melbourne",
            date: "2024-01-14",
            prize: "$2.3M",
            favoritePlayer: "Novak Djokovic"
        };

        const response = await request(app)
            .post("/api/tournaments")
            .send(newTournament);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(newTournament);
        expect(response.body.id).toBeDefined();

       
        const getResponse = await request(app).get("/api/tournaments");
        expect(getResponse.body.length).toBe(3);
    });

    test("should require name, location, and date", async () => {
        const invalidTournament = {
            prize: "$1M"
        };

        const response = await request(app)
            .post("/api/tournaments")
            .send(invalidTournament);

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("required");
    });

    test("should set default values for optional fields", async () => {
        const minimalTournament = {
            name: "French Open",
            location: "Paris",
            date: "2024-05-26"
        };

        const response = await request(app)
            .post("/api/tournaments")
            .send(minimalTournament);

        expect(response.status).toBe(201);
        expect(response.body.prize).toBe("TBD");
        expect(response.body.favoritePlayer).toBe("Not specified");
    });
});