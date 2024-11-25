const express = require('express')
const cors = require('cors')
const cron = require('node-cron');

const app = express();

const port = 3000;



var corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

require('./routes/auth-route.js')(app);
require("./routes/todo-routes.js")(app);
require("./routes/daily-route.js")(app);
require("./routes/habit-route.js")(app);
require("./routes/stats-route.js")(app);
require("./routes/tag-route.js")(app);

const db = require("./models");
const LevelReward = db.LevelReward;
const User = db.user;
const Quests = db.dailyquest;
const ToDoModel = db.todo;
const HabitModel = db.habit;

cron.schedule('0 0 * * *', async () => { 
    try {
        console.log("Resetting daily quests...");

        await Quests.update(
            { completedAt: null },
            { where: {} }
        );

        console.log("Daily quests reset successfully.");
    } catch (error) {
        console.error("Error resetting quests:", error);
    }
});

    // db.sequelize.sync({force: true}).then(() => {
    //    console.log('Drop and Resync Db');
    //    initial();
    //  });

function initial() {
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
    const levelRewards = [
        {"level": 1, "experienceThreshold": 0, "goldReward": 0},
        {"level": 2, "experienceThreshold": 100, "goldReward": 10},
        {"level": 3, "experienceThreshold": 300, "goldReward": 20},
        {"level": 4, "experienceThreshold": 600, "goldReward": 30},
        {"level": 5, "experienceThreshold": 1000, "goldReward": 40},
        {"level": 6, "experienceThreshold": 1500, "goldReward": 50},
        {"level": 7, "experienceThreshold": 2100, "goldReward": 60},
        {"level": 8, "experienceThreshold": 2800, "goldReward": 70},
        {"level": 9, "experienceThreshold": 3600, "goldReward": 80},
        {"level": 10, "experienceThreshold": 4500, "goldReward": 90},
        {"level": 11, "experienceThreshold": 5500, "goldReward": 100},
        {"level": 12, "experienceThreshold": 6600, "goldReward": 110},
        {"level": 13, "experienceThreshold": 7800, "goldReward": 120},
        {"level": 14, "experienceThreshold": 9100, "goldReward": 130},
        {"level": 15, "experienceThreshold": 10500, "goldReward": 140},
        {"level": 16, "experienceThreshold": 12000, "goldReward": 150},
        {"level": 17, "experienceThreshold": 13600, "goldReward": 160},
        {"level": 18, "experienceThreshold": 15300, "goldReward": 170},
        {"level": 19, "experienceThreshold": 17100, "goldReward": 180},
        {"level": 20, "experienceThreshold": 19000, "goldReward": 190},
        {"level": 21, "experienceThreshold": 21000, "goldReward": 200},
        {"level": 22, "experienceThreshold": 23100, "goldReward": 210},
        {"level": 23, "experienceThreshold": 25300, "goldReward": 220},
        {"level": 24, "experienceThreshold": 27600, "goldReward": 230},
        {"level": 25, "experienceThreshold": 30000, "goldReward": 240},
        {"level": 26, "experienceThreshold": 32500, "goldReward": 250},
        {"level": 27, "experienceThreshold": 35100, "goldReward": 260},
        {"level": 28, "experienceThreshold": 37800, "goldReward": 270},
        {"level": 29, "experienceThreshold": 40600, "goldReward": 280},
        {"level": 30, "experienceThreshold": 43500, "goldReward": 290}
    ]
    
    for (let level of levelRewards) {
        LevelReward.create(level);
    }
    // for (const quest of quests) {
    //     Quests.create(quest);
    // }
}


app.get("/", (req, res) => {
    res.json({message: "Welcome!"});
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});

// async function populateDatabase(userId) {
//     const startDate = new Date('2024-11-11');
//     const endDate = new Date('2024-11-17');
//     const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

//     function getRandomDateBetween(startDate, endDate) {
//         const diff = endDate.getTime() - startDate.getTime();
//         return new Date(startDate.getTime() + random(0, diff));
//     }
//     for (let i = 1; i <= 15; i++) {
//         const randomDate = getRandomDateBetween(startDate, endDate);
//         await ToDoModel.create({
//             title: `ToDo Title ${i}`,
//             userId,
//             description: `ToDo Description ${i}`,
//             dueDate: randomDate
//         });
//     }

//     const weekDaysSelected = [true, true, true, true, true, true, true];

//     for (let i = 1; i <= 15; i++) {
//         const randomDate = getRandomDateBetween(startDate, endDate);
//         const notificationTime = i <= 7 ? '07:00:00' : '17:00:00';
//         await HabitModel.create({
//             habitId: i,
//             userId,
//             description: `Description of habit ${i}`,
//             title: `Habit Title ${i}`,
//             isFinished: false,
//             streak: 0,
//             createdAt: new Date(),
//             startDate: randomDate,
//             notificationTime,
//             weekDaysSelected: JSON.stringify(weekDaysSelected),
//             completionDates: JSON.stringify([]),
//             dateGoal: 30,
//             goalDuration: 'Daily',
//             group: i <= 7 ? 'Morning' : 'Afternoon'
//         });
//     }

//     for (let i = 1; i <= 10; i++) {
//         const randomDate = getRandomDateBetween(startDate, endDate);
//         const notificationTime = i % 2 === 0 ? '09:00:00' : '18:00:00';
//         await HabitModel.create({
//             description: `Habit Description ${i}`,
//             title: `Habit Title ${i}`,
//             isFinished: false,
//             streak: 0,
//             createdAt: new Date(),
//             startDate: randomDate,
//             notificationTime,
//             weekDaysSelected: JSON.stringify(weekDaysSelected),
//             completionDates: JSON.stringify([]),
//             dateGoal: 30,
//             goalDuration: 'Daily'
//         });
//     }

//     for (let i = 1; i <= 10; i++) {
//         const randomDate = getRandomDateBetween(startDate, endDate);
//         await ToDoModel.create({
//             title: `ToDo Title ${i}`,
//             userId,
//             description: `ToDo Description ${i}`,
//             dueDate: randomDate
//         });
//     }
// }

// (async () => {
//     try {
//         const userId = 1; // Example userId
//         await populateDatabase(userId);
//         console.log('Database populated successfully.');
//     } catch (err) {
//         console.error('Error populating database:', err);
//     }
// })();
