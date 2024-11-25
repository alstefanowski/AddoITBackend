const db = require("../models");
const config = require("../config/auth-config");
const Todo = db.todo;
const SubTodo = db.SubTodo;
const TodoTags = db.TodoTags;
const Tag = db.Tag;
const sequelize = db.sequelize;

const User = db.user;
const { Sequelize } = require('sequelize');
const Op = db.Sequelize.Op;
const authJwt = require("../middleware/auth-jwt");
const { TIME } = require("sequelize");

exports.create = async (req, res) => {
    if(!req.body.title) {
        res.status(400).send({
            message: "Content can't be empty"
        });
        return;
    }
    
    const todoData = {
        title: req.body.title,
        description: req.body.description,
        isFinished: req.body.isFinished ? req.body.isFinished : false,
        userId: req.body.userId,
        priority: req.body.priority,
        deadline: req.body.deadline,
        dateReminder: req.body.dateReminder,
        dateFinished: req.body.dateFinished,
        isSynced: true
    };
        Todo.create(todoData)
        .then(data => {
            res.send(data);
            data.setChild
        })
        .catch(err => {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating Todo."
            });
          });

    // try {
    //     const todo = await Todo.create(todoData);
    //     console.log(todo);

    //     if (req.body.subTodos && Array.isArray(req.body.subTodos)) {
    //         const subTodos = req.body.subTodos.map(subTodo => ({
    //             title: subTodo.title,
    //             todoId: todo.id,
    //             isFinished: subTodo.isFinished || false
    //         }));
    //         await SubTodo.bulkCreate(subTodos);
    //     }
    //     res.status(201).send(todo);
    // } catch (err) {
    //     res.status(500).send({
    //         message: err.message || "Some error occurred while creating Todo."
    //     });
    // }

}

exports.createTag = async (req, res) => {
    try {
        const title = req.body.title;
        
        if (!title) {
            return res.status(404).send({message: "No title provided"});
        }

        const existingTag = await Tag.findOne({ where: { title } });

        if (existingTag) {
            return res.status(409).send("Tag with this title already exists");
        }
    
        const newTag = await Tag.create({
            title,
            isSelected: false,
        });
    
        res.status(201).send({newTag});
    } catch (err) {
        console.error("createTag" + err);
        res.status(500).send({message: err.message});
    }    
}

exports.deleteTags = (req, res) => {
    Tag.destroy({
        where: {}
    })
    .then(nums => {
        res.send({ message: `${nums} Tags were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all tags."
        });
    });
} 
exports.deleteTagById = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    try {
        const tagToDelete = await Tag.findOne({
            where: {
                tagId: id
            }
        })
        console.log(tagToDelete);
        if (!tagToDelete) {
            return res.status(404).send({message: "Tag not found"});
        }
        await Tag.destroy({
            where: {
                tagId: id
            }
        });
        res.status(200).send({message: "Tag deleted"});
    } catch (err) {
        console.error(err);
        res.status(500).send({message: err.message});
    }
}

exports.findAll = async (req, res) => {
    const userId = req.params.id;
    const title = req.query.title;

    try {
        const user = await User.findByPk(userId); 
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
        const todos = await Todo.findAll({
            where: {
                userId: userId,
                ...condition
            }
        });
        const transformedTodos = todos.map(todo => ({
            ...todo.toJSON(),
            todoId: todo.id,
        }));

        console.log(transformedTodos);
        res.status(200).send(transformedTodos);
    } catch (err) {
        res.status(500).send({ message: err.message || "Some error occurred while retrieving todos." });
    }
};


exports.findById = (req, res) => {
    const id = req.params.id

    Todo.findByPk(id)
     .then(data => {
        if (data) {
            res.send(data);
        }
        else {
            res.status(404).send({
                message: `Cannot find todo with id=${id}`
            })
        }
     })
     .catch(err => {
        res.status(500).send({message: `error with retrieving todo with id=${id}`, err: err})
    })
}

exports.fetchUpdatedAt = async (req, res) => {
    const id = req.params.id;

    try {
        const todo = await Todo.findOne({
            where: {
                id: id
            },
            attributes: ['updatedAt']
        });
        if (!todo) {
            return res.status(404).json({error: 'Todo not found'});
        }
        res.json({updatedAt: todo.updatedAt.toISOString()});
    } catch (err) {
        console.error(err);
        res.status(500).json({error: err.message});
    }
}

exports.update = async (req, res) => {
    const id = req.params.id;
    const {
        title,
        description,
        isFinished,
        dateFinished,
        priority,
        deadline,
        dateReminder,
        timeSpent,
        subTodos,
        tags
    } = req.body;

    const transaction = await sequelize.transaction();

    try {
        const todo = await Todo.findByPk(id);
        if (!todo) {
            return res.status(404).send({ message: 'Todo not found' });
        }

        await todo.update(
            { title, description, isFinished, dateFinished, priority, deadline, dateReminder, timeSpent },
            { transaction }
        );

        if (subTodos && Array.isArray(subTodos)) {
            const existingSubTodoIds = subTodos.filter(st => st.id).map(st => st.id);
            await SubTodo.destroy({
                where: { todoId: id, id: { [Sequelize.Op.notIn]: existingSubTodoIds } },
                transaction
            });

            for (const subTodoData of subTodos) {
                if (subTodoData.id) {
                    await SubTodo.update(
                        { title: subTodoData.title, isFinished: subTodoData.isFinished },
                        { where: { id: subTodoData.id }, transaction }
                    );
                } else {
                    await SubTodo.create({ ...subTodoData, todoId: id }, { transaction });
                }
            }
        }

        if (tags && Array.isArray(tags)) {
            await TodoTags.destroy({ where: { todoId: id }, transaction });
            const newTags = tags.map(tagId => ({ todoId: id, tagId }));
            await TodoTags.bulkCreate(newTags, { transaction });
        }
        await transaction.commit();
        res.send({ message: 'Todo updated successfully.' });
    } catch (error) {
        await transaction.rollback();
        console.error(`Error updating Todo with id=${id}:`, error);
        res.status(500).send({ message: `Error updating Todo with id=${id}`, error });
    }
};



exports.updateTime = async (req, res) => {
    const id = req.params.id;
    const { timeSpent } = req.body; 
    
    try {
        if (!timeSpent) {
            return res.status(400).json({ message: "Missing required field: timeSpent" });
        }

        const [updatedRows] = await Todo.update(
            { timeSpent: timeSpent },  
            { where: { id } } 
        );

        if (updatedRows === 0) {
            return res.status(404).json({ message: `Todo with id ${id} not found` });
        }

        res.status(200).json({ message: "Todo updated successfully" });
    } catch (error) {
        console.error('Error updating Todo:', error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    const { isFinished, dateFinished } = req.body; 

    try {
        if (isFinished == null) {
            return res.status(400).send({ message: 'Missing required parameter - isFinished'});
        }

        const [updatedRows] = await Todo.update(
            { isFinished: isFinished, dateFinished: dateFinished },  
            { where: { id } } 
        );
        if (updatedRows === 0) {
            return res.status(404).json({ message: `Todo with id ${id} not found` });
        }
        res.status(200).send({ message: "Todo updated successfully" });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


exports.delete = (req, res) => {
    const id = req.params.id

    Todo.destroy({
        where: {id: id}
    })
    
    .then(num => {
        if (num == 1) {
            res.send({message: "Todo deleted successfully"})
        }
        else {
            res.send({message: `Cannot delete todo with id ${id}. Todo probably wasn't found`});
        }
    })
    .catch(err => {
        res.status(500).send({message: err.message + id})
    })
}

exports.deleteAll = (req, res) => {

    Todo.destroy({
        where: {}
    })
    .then(nums => {
        res.send({ message: `${nums} Todos were deleted successfully!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while removing all todos."
        });
    });
}

exports.syncTodos = async (req, res) => {
    try {
        const todos = req.body.todos;

        if (!Array.isArray(todos)) {
            return res.status(400).send({message: "Invalid data format"})
        }

        const updatedTodos = [];

        for (const todo of todos) {
            if (!Todo.id) {
                const newTodo = await Todo.create(todo);
                updatedTodos.push({ ...newTodo.dataValues, todoId: newTodo.id });
            } else {
                const [updated] = await Todo.update(todo, {
                    where: { id: todo.id },
                });
                if (updated) {
                    const updatedTodo = await Todo.findByPk(todo.id);
                    updatedTodo.push({ ...updatedTodo.dataValues, todoId: updatedTodo.id });
                }
            }
        }
        res.send(updatedTodos);
    } catch (error) {
        console.error("Error syncing habits:", error);
        res.status(500).send({
            message: "Error occurred while syncing habits.",
            error: error.message,
        });
    }
}


exports.synchronizeTodos