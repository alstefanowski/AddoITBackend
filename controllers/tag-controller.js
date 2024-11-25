const db = require("../models");
const config = require("../config/auth-config");
const Todo = db.todo;
const TodoStat = db.TodoStat
const Tag = db.Tag;
const User = db.user;
const HabitStat = db.HabitStat;
const LevelReward = db.LevelReward;
const Op = db.Sequelize.Op;

exports.create = async (req, res) => {

    if (!req.body.title) {
        return res.status(400).send({
            message: "Content can't be empty"
        });
    }

    const tag = {
        title: req.body.title,
        isSelected: req.body.isSelected
    };

    try {
        const data = await Tag.create(tag);
        res.status(201).send(data);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the tag."
        });
    }
}

exports.syncTags = async (req, res) => {
    try {
        const tags = req.body.tags;

        if (!Array.isArray(tags)) {
            return res.status(400).send({ message: "Invalid data format" });
        }

        const updatedTags = [];

        for (const tag of tags) {
            if (!tag.tagId) {
                const newTag = await Tag.create(tag);
                updatedTags.push({ ...newTag.dataValues, tagId: newTag.tagId });
            } else {
                const [updated] = await Tag.update(tag, {
                    where: { tagId: tag.tagId },
                });
                if (updated) {
                    const updatedTag = await Tag.findByPk(tag.tagId);
                    updatedTags.push({ ...updatedTag.dataValues, tagId: updatedTag.tagId });
                }
            }
        }
        res.send(updatedTags);
    } catch (error) {
        console.error("Error syncing tags:", error);
        res.status(500).send({
            message: "Error occurred while syncing tags.",
            error: error.message,
        });
    }
};
