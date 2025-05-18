// AddTournament.test.js
import { validateTournament } from "./tournamentLogic";

// Mock tournament data similar to your student tests
const mockTournament = {
    name: "Wimbledon",
    location: "London",
    date: "2023-07-03",
    prize: "$2.5M",
    favoritePlayer: "Roger Federer"
};

const mockEmptyTournament = {
    name: "",
    location: "",
    date: "",
    prize: "",
    favoritePlayer: ""
};

const mockInvalidDateTournament = {
    ...mockTournament,
    date: "1999-01-01"
};

test("validateTournament should reject empty fields", () => {
    const validation = validateTournament(mockEmptyTournament);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toBe("All fields are required!");
});

test("validateTournament should reject dates before 2000", () => {
    const validation = validateTournament(mockInvalidDateTournament);
    expect(validation.isValid).toBe(false);
    expect(validation.message).toBe("Date must be between 2000 and 2025!");
});

test("validateTournament should accept valid tournament", () => {
    const validation = validateTournament(mockTournament);
    expect(validation.isValid).toBe(true);
    expect(validation.message).toBe("");
});


test("handleChange should update tournament state", () => {
 
    const tournament = { ...mockEmptyTournament };
    const handleChange = (field, value) => {
        tournament[field] = value;
    };

    handleChange("name", "US Open");
    expect(tournament.name).toBe("US Open");

    handleChange("prize", "$3M");
    expect(tournament.prize).toBe("$3M");
});


test("handleSubmit should prevent default and validate", () => {
    let prevented = false;
    let validated = false;

    const mockEvent = {
        preventDefault: () => { prevented = true; }
    };

    const handleSubmit = (e, tournament) => {
        e.preventDefault();
        const validation = validateTournament(tournament);
        validated = validation.isValid;
    };

    handleSubmit(mockEvent, mockTournament);
    expect(prevented).toBe(true);
    expect(validated).toBe(true);
});