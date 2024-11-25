const db = require("../models");
const config = require("../config/auth-config");
const Todo = db.todo;
const TodoStat = db.TodoStat
const User = db.user;
const HabitStat = db.HabitStat;
const LevelReward = db.LevelReward;
const Quest = db.Quest;
const Op = db.Sequelize.Op;
const authJwt = require("../middleware/auth-jwt")

exports.fetchTodoStats = async (req, res) => {
    const userId = req.params.id;
    // const dateCompleted = req.body.dateCompleted ? new Date(req.body.dateCompleted) : null;
    // console.log("haloooooooooooooooooooo")
    // console.log(dateCompleted);

    try {
        let user = await User.findOne({ where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const todoStats = await TodoStat.findOne({
            where: {id: userId}
        });

        if (!todoStats) {
            return res.status(404).json({ message: "No statistics found for this user" });
        }

        return res.status(200).json(todoStats);

    } catch (error) {
        console.error("Error fetching data", error);
        return res.status(500).json({ message: error});
    }
}

exports.saveTodoStats = async (req, res) => {
    const { userId, totalCompletedTasks, totalTimeSpent } = req.body;
    const dateCompleted = req.body.dateCompleted ? new Date(req.body.dateCompleted) : null;

    try {
        let user = await User.findOne({ where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        let todoStats = await TodoStat.findOne({ where: { userId } });

        if (!todoStats) {
            todoStats = await TodoStat.create({
                userId,
                totalCompletedTasks,
                totalTimeSpent,
                dateCompleted,
                lastUpdated: new Date(),
            });
        } else {
            todoStats.totalCompletedTasks = totalCompletedTasks;
            todoStats.totalTimeSpent = totalTimeSpent;
            todoStats.dateCompleted = dateCompleted;
            todoStats.lastUpdated = new Date();
            await todoStats.save();
        }

        return res.status(200).json(todoStats);
    } catch (error) {
        console.error("Error saving stats:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

exports.fetchHabitStats = async (req, res) => {
    const userId = req.params.id;

    try {
        let user = await User.findOne({ where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const habitStats = await HabitStat.findOne({ where: {id: userId}})
        if (!habitStats) {
            return res.status(404).json({message: "Habit stattistics not found"});
        }
        res.status(200).json({habitStats});
    } catch (error) {
        console.error("Error fetching stats:", error);
        return res.status(500).json({message: "Internal Server Error" + error.message});
    }
}

exports.saveHabitStats = async (req, res) => {
    const {userId, biggestStreak, weekDaysCompleted} = req.body;

    try {
        let user = await User.findOne({ where: {id: userId}});
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        let habitStats = await HabitStat.findOne({where: {userId}});

        if (!habitStats) {
            habitStats = await HabitStat.create({
                userId,
                biggestStreak,
                weekDaysCompleted,
                lastUpdated: new Date(),
            });
        } else {
            habitStats.biggestStreak = biggestStreak;
            habitStats.weekDaysCompleted = weekDaysCompleted;
            habitStats.lastUpdated = new Date();
            await habitStats.save();
        }
        return res.status(200).json(habitStats);
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: err.message});
    }
}

exports.getLevelInfo = async (req, res) => {
    try {
        const rewards = await LevelReward.findAll({
            order: [['level', 'ASC']]
        });
        res.status(200).json(rewards);
    } catch (err) {
        console.error(err);
        res.stauts(500).json({ message: 'Error fetching level rewards' });
    }
}

exports.createQuest = async (req, res) => {
    try {
        const { userId, type } = req.body;

        if (!["todo", "habit"].includes(type)) {
            return res.status(400).json({ message: "Invalid quest type" });
        }

        const existingQuest = await Quest.findOne({
            where: {
                userId: userId,
                type: type
            }
        });

        if (existingQuest) {
            return res.status(400).json({ message: "Quest already exists for this type" });
        }

        const newQuest = await Quest.create({
            userId: userId,
            type: type,
            completedAt: Date.now()
        });

        return res.status(201).json(newQuest);
    } catch (error) {
        console.error("Error creating quest:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


exports.checkQuestCompletion = async (req, res) => {
    try {
        const { userId, type } = req.params;

        const completedQuest = await Quest.findOne({
            where: {
                userId: userId,
                type: type,
                completedAt: {
                    [Op.ne]: null, 
                }
            }
        });

        const isCompleted = completedQuest !== null;
        return res.status(200).json({ completed: isCompleted });
    } catch (error) {
        console.error("Error checking quest completion:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}