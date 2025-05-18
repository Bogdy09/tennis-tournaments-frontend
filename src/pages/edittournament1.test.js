import request from "supertest";
import { app } from "../../server.js";

describe("PATCH /api/tournaments/:id", () => {
    beforeEach(() => {
        
       
    });

    test("should update existing tournament", async () => {
        const updates = { prize: "$3.5M", favoritePlayer: "Carlos Alcaraz" };
        const response = await request(app)
            .patch("/api/tournaments/1")
            .send(updates);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: 1,
            name: "US Open", 
            prize: "$3.5M", 
            favoritePlayer: "Carlos Alcaraz"
        });

        // Verify the update persisted
        const getResponse = await request(app).get("/api/tournaments/1");
        expect(getResponse.body.prize).toBe("$3.5M");
    });

    test("should return 404 for non-existent tournament", async () => {
        const response = await request(app)
            .patch("/api/tournaments/999")
            .send({ prize: "$4M" });

        expect(response.status).toBe(404);
    });

    test("should reject invalid fields", async () => {
        const response = await request(app)
            .patch("/api/tournaments/1")
            .send({ invalidField: "test" });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain("No valid fields");
        expect(response.body.validFields).toBeDefined();
    });

    test("should partially update tournament", async () => {
        const response = await request(app)
            .patch("/api/tournaments/2")
            .send({ location: "London, UK" }); 

        expect(response.status).toBe(200);
        expect(response.body.location).toBe("London, UK");
        expect(response.body.prize).toBe("$2.5M"); 
    });
});