const db = require('../models')
const config = require("../config/auth-config");
const Daily = db.dailyquest

//https://github.com/node-schedule/node-schedule

exports.resetDaily = async (req, res) => {
    try {
        const randomQuests = await Daily.findAll({
            order: db.sequelize.random(),
            limit: 3
        });
        console.log(randomQuests);
        return res.status(200).json(randomQuests);
    } catch (err) {
        console.error("Error fetching random quests:", err);
        return res.status(500).json({ message: "Error fetching random quests" })
    }
}
