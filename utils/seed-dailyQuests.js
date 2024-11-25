const db = require('../models');
const Daily = db.dailyquest;

const seedDailyQuests = async () => {
    try {
        const quests = [
            {
                title: "Wykonaj 5 zadań",
                experiencePoints: 50,
                deadline: new Date(new Date().setHours(23, 59, 59))
            },
            {
                title: "Zrób 3 pomodoro",
                experiencePoints: 30,
                deadline: new Date(new Date().setHours(23, 59, 59))
            },
            {
                title: "Zrób wszystkie nawyki jakie masz na dzisiaj",
                experiencePoints: 40,
                deadline: new Date(new Date().setHours(23, 59, 59))
            },
            {
                title: "Przeczytaj 30 stron książki",
                experiencePoints: 20,
                deadline: new Date(new Date().setHours(23, 59, 59))
            },
            {
                title: "Zrób 15 minut ćwiczeń",
                experiencePoints: 25,
                deadline: new Date(new Date().setHours(23, 59, 59))
            }
        ];
        await Daily.bulkCreate(quests);
        console.log("Przykładowe zadania zostały dodane do bazy danych.");
    } catch (error) {
        console.error("Błąd podczas dodawania zadań do bazy danych:", error);
    }
};

seedDailyQuests();