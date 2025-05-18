// tournamentLogic.js
export function validateTournament(tournament) {
    if (Object.values(tournament).some(field => !field)) {
        return { isValid: false, message: "All fields are required!" };
    }

    const year = new Date(tournament.date).getFullYear();
    if (year < 2000 || year > 2025) {
        return { isValid: false, message: "Date must be between 2000 and 2025!" };
    }

    return { isValid: true, message: "" };
}




// New functions for EditTournament
export function prepareEditData(tournament) {
    return {
        name: tournament?.name || "",
        location: tournament?.location || "",
        date: tournament?.date || "",
        prize: tournament?.prize || "",
        favoritePlayer: tournament?.favoritePlayer || ""
    };
}

export function handleFieldChange(currentData, field, value) {
    return { ...currentData, [field]: value };
}