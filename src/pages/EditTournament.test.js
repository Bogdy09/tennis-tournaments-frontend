// EditTournament.test.js
import { validateTournament, prepareEditData, handleFieldChange } from './tournamentLogic';

const mockTournament = {
    id: 1,
    name: "Wimbledon",
    location: "London",
    date: "2023-07-03",
    prize: "$2M",
    favoritePlayer: "Federer"
};

test("prepareEditData should initialize empty form data", () => {
    const emptyData = prepareEditData(null);
    expect(emptyData.name).toBe("");
    expect(emptyData.location).toBe("");
});

test("prepareEditData should populate from existing tournament", () => {
    const formData = prepareEditData(mockTournament);
    expect(formData.name).toBe("Wimbledon");
    expect(formData.prize).toBe("$2M");
});

test("handleFieldChange should update specific field", () => {
    const updated = handleFieldChange(mockTournament, "name", "NEW NAME");
    expect(updated.name).toBe("NEW NAME");
    expect(updated.location).toBe("London"); 
});

test("validateTournament should reject empty fields", () => {
    const validation = validateTournament({
        name: "",
        location: "Paris",
        date: "2023-01-01",
        prize: "$1M",
        favoritePlayer: ""
    });
    expect(validation.isValid).toBe(false);
});