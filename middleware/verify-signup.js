const db = require("../models/index");
const User = db.user;

const checkIfUserAlreadyExists = (req, res, next) => {
    console.log(req.body);

    if (!req.body || !req.body.username || !req.body.email) {
        return res.status(400).send({
            message: "Username and email are required"
        });
    }

    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if (user) {
            return res.status(400).send({
                message: "Username is already in use"
            });
        }

        return User.findOne({
            where: {
                email: req.body.email
            }
        });
    })
    .then(user => {
        if (user) {
            return res.status(400).send({
                message: "Email is already in use"
            });
        }

        next();
    })
    .catch(err => {
        if (!res.headersSent) {
            res.status(500).send({
                message: err.message
            });
        }
    });
};


const signUp = {
    checkIfUserAlreadyExists: checkIfUserAlreadyExists
};

module.exports = signUp;
