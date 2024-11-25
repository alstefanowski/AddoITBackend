const db = require("../models")
const config = require("../config/auth-config");
const { LocalDate } = require('js-joda');

const Habit = db.habit;
const User = db.user;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
    if (!req.body.title) {
        return res.status(400).send({
            message: "Content can't be empty"
        });
    }

    const habit = {
        title: req.body.title,
        userId: req.body.userId,
        datePicker: req.body.datePicker,
        description: req.body.description,
        isFinished: req.body.isFinished,
        streak: req.body.streak,
        completionsDate: req.body.completionsDate,
        dateGoal: req.body.dateGoal,
        group: req.body.group,
        isSynced: req.body.isSynced,
        notification: req.body.notification,
        goalDuration: req.body.goalDuration,
        weekDaysSelected: req.body.weekDaysSelected,
        daysNotificationSelected: req.body.daysNotificationSelected
    };

    Habit.create(habit)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating Habit."
            });
        });
};


exports.update = (req, res) => {
    console.log("tu jestme");
    const id = req.params.id;
    console.log("user:");
    console.log(id);
    Habit.update(req.body, {
        where: {id: id}
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Habit updated successfully"});
        } else {
            res.send({message: `Cannot update habit with id=${id}, Habit is empty or not found body response`})
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating habit with id" + id,
            error: err.message
        });
    });
}

exports.deleteAll = (req, res) => {
    Habit.destroy({where: {}})
    .then(nums => {
        res.send({ message: `${nums} Habits were deleted successfully!`})
    })
    .catch(err => {
        res.status(500).send({
            message:
              err.message || "Some error occurred while removing all habits."
          });
    })
}

exports.syncHabits = async (req, res) => {
    try {
        const habits = req.body.habits;

        if (!Array.isArray(habits)) {
            return res.status(400).send({message: "Invalid data format"})
        }

        const updatedHabits = [];

        for (const habit of habits) {
            if (!Habit.id) {
                const newHabit = await Habit.create(habit);
                updatedHabits.push({...newHabit.dataValues, habitId: newHabit.id});
            } else {
                const [updated] = await Habit.update(habit, {
                    where: { id: habit.id },
                });
                if (updated) {
                    const updatedHabit = await Habit.findByPk(habit.id);
                    updatedHabits.push({...updatedHabit.dataValues, habitId: updatedHabit.id});
                }
            }
        }
        res.send(updatedHabits);
    } catch (error) {
        console.error("Error syncing habits:", error);
        res.status(500).send({
            message: "Error occurred while syncing habits.",
            error: error.message,
        });
    }
}

exports.fetchAll = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({message: 'User not found'});
        }
        const habits = await Habit.findAll({
            where: {userId: id}
        });
        if (habits.length === 0) {
            return res.status(404).send({message: 'No habits found for this user'});
        }
        const transformedHabits = habits.map(habit => ({
            ...habit.toJSON(),
            habitId: habit.id,
        }));
        res.status(200).send(transformedHabits);
    } catch (err) {
        console.error(err);
        res.status(500).send({
            message: "Error in fetchAll habit-controller",
            error: err.message
        });
    }
}