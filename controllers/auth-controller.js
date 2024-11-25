const db = require("../models");
const config = require("../config/auth-config");
const User = db.user;
const Habit = db.habit;
const Todo = db.todo;
const Token = db.token;
const Quest = db.Quest;
const Milestone = db.milestone;
const nodemailer = require('nodemailer');
const sendEmail = require('../utils/emails/send-email');
const bcryptSalt = process.env.BCRYPT_SALT

var jwt = require("jsonwebtoken")
var bcrypt = require("bcryptjs")
var crypto = require("crypto");
const { Op } = require('sequelize');

const {body, validationResult} = require('express-validator');
const Joi = require('joi');


exports.signup = (req, res) => {

    User.create({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        isVerified: false,
        emailVerificationToken: crypto.randomBytes(32).toString('hex')
    })

    .then((user) => {
        if (!res.headersSent) {
            const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${user.emailVerificationToken}`;
            const subject = 'Email Verification';
            const text = `Please verify your email by clicking the link: ${verificationUrl}`;
//user.email
            sendEmail(user.email, subject, text)
                .then(() => {
                    res.send({ message: "User created successfully. Please check your email for verification!" });
                })
                .catch(err => {
                    res.status(500).send({ message: "User created but failed to send verification email" });
                });
        }
    })
    .catch(err => {
        res.status(500).send( {message: err.message} );
    })
}

exports.signin = (req, res) => {
    if (req.body.username ===  undefined && req.body.email === undefined) {
        return res.status(404).send({message: "username is required"})
    }

    const condition = [];
    if (req.body.username) {
        condition.push({ username: req.body.username });
    }
    if (req.body.email) {
        condition.push({ email: req.body.email });
    }

    User.findOne({
        where: {
            [Op.or]: condition
        }
    })
        .then(user => {
            if (!user) {
                return res.status(404).send({message: "User not found"});
            }
            if (!user.isVerified) {
                return res.status(403).send({message: "You need to verify your account by email you provided"})
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );
            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid password"
                });
            }
    
            const token = jwt.sign({id: user.id},
                config.secret,
                {
                    algorithm: 'HS256',
                    allowInsecureKeySizes: true,
                    expiresIn: 86400,
                });
            res.status(200).send({
                id: user.id,
                username: user.username,
                email: user.email,
                coins: user.coins,
                accessToken: token,
                dailyHabitCompleted: user.dailyHabit,
                dailyTodoCompleted: user.dailyTodo
            });
        })
       .catch(err => {
        res.status(500).send({message: err.message});
    });
}

exports.verifyEmail = (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).send({ message: "Verification token is missing." });
    }
    console.log(token);
    User.findOne({
        where: {
            emailVerificationToken: token
        }
    })
    .then(user => {
        console.log(user);
        if (!user) {
            return res.status(400).send({ message: "Invalid or expired verification token." });
        }

        user.isVerified = true;
        user.emailVerificationToken = null;
        user.save()
            .then(() => res.status(200).send({ message: "Email successfully verified." }))
            .catch(err => res.status(500).send({ message: "Error verifying email." }));
    })
    .catch(err => res.status(500).send({ message: err.message }));
}

exports.forgotPassword = async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                email: req.body.email
            }
        });
        if (!user) {
            return res.status(404).send("Email is not associated with any user");
        }

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken, Number(bcryptSalt));

        await Token.create({
            userId: user.id,
            token: hash,
        });



        const resetLink = `http://localhost:3000/api/auth/reset-password?token=${resetToken}&id=${user.id}`;
        const emailHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    color: #333;
                    padding: 20px;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 40px;
                }
                .header h1 {
                    color: #4CAF50;
                }
                .content {
                    line-height: 1.6;
                }
                .reset-link {
                    display: inline-block;
                    margin: 20px 0;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
                .footer {
                    margin-top: 40px;
                    text-align: center;
                    font-size: 0.9em;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    <p>A request has been made to reset your Addoit password. You can reset your password by clicking the link below:</p>
                    <a href="${resetLink}" class="reset-link">Reset Password</a>
                    <p>If you did not request a password reset, please ignore this email.</p>
                    <p>Thank you,<br>The Addoit Team</p>
                </div>
                <div class="footer">
                    <p>&copy; 2024 Addoit. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>`;
        
        await sendEmail(user.email, "Password Reset for Addoit", emailHtml);

        return res.status(200).send("Password reset link has been sent to your email.");
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.resetPassword = async (req, res) => {
    const { token, id } = req.query;
    const { password, confirmPassword } = req.body;
    
    try {
        
        if (password !== confirmPassword) {
            return res.status(400).send({ message: "Password not match"});
        }

        const passwordResetToken = await Token.findOne({
            where: {
                userId: id
            }
        })
        if (!passwordResetToken) {
            return res.status(400).send({ message: "Invalid or expired password reset token." });
        }

        const isValid = await bcrypt.compare(token, passwordResetToken.token);
        if (!isValid) {
            return res.status(400).send({ message: "Invalid or expired password reset token." });
        }

        const user = await User.findOne({ where: { id } });
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        user.password = bcrypt.hashSync(password, 8);
        await user.save();

        await passwordResetToken.destroy();

        return res.status(200).send({ message: "Password has been reset successfully." });

    } catch (err) {
        return res.status(500).send({ message: err.message });
    }

};

const usernameSchema = Joi.object({
    username: Joi.string()
        .pattern(/^[a-zA-Z0-9._]{5,15}$/)
        .required()
        .messages({
            'string.base': 'Username must be a string',
            'string.empty': 'Username cannot be empty',
            'string.pattern.base': 'Username must be between 5 and 15 characters long and can only contain letters, numbers, dots, and underscores',
            'any.required': 'Username is required'
        })
})
exports.updateUsername = async (req, res) => {

    const { error} = usernameSchema.validate(req.body);
    if (error) {
        return res.status(400).send({ message: error.details[0].message});
    }

    const username = req.body.username;
    const id = req.params.id;

    if (!username) {
        return res.status(400).send({message: "Username is required"});
    }

    try {
        const [updated] = await User.update(
            { username: username }, 
            { where: { id: id } }  
        );

        if (updated) {
            const updatedUser = await User.findOne({where: {id: id}})
            return res.status(200).json(updatedUser);
            //const updatedUser = await User.findOne({ where: { id: id } });
            //res.status(200).json(updatedUser);
        } else {
            res.status(404).send({ message: "User not found" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: err.message });
    }
}
exports.updateEmail = async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;
    const id = req.params.id;

    try {
        const user = await User.findOne({ where: { id: id } });

        if (!user) {
            return res.status(404).send({ message: "Error: User not found" });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid password' });
        }

        user.email = email;
        user.isVerified = false; 
        user.emailVerificationToken = crypto.randomBytes(32).toString('hex');

        await user.save();

        const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${user.emailVerificationToken}`;
        const subject = 'Email Verification';
        const text = `Please verify your new email by clicking the link: ${verificationUrl}`;

        await sendEmail(email, subject, text); 

        return res.status(200).send({ message: 'Email updated successfully. Please verify your new email address.' });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }
}

exports.updatePassword = async (req, res) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const repeatNewPassword = req.body.repeatNewPassword;
    const id = req.params.id;
    
    try {
        const user = await User.findOne({ where: {id: id}});
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        const passwordIsValid = await bcrypt.compare(oldPassword, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ message: 'Invalid old password'});
        }
        if (newPassword !== repeatNewPassword) {
            return res.status(400).send({ message: 'New passwords do not match' });
        }
        if (newPassword === oldPassword) {
            return res.status(400).send({ message: 'New password are the same as old password' });
        }
        
        await User.update({ password: bcrypt.hashSync(newPassword, 8) }, { where: { id: id } });
        return res.status(200).send({ message: 'Password changed successfully' });
    } catch (err) {
        return res.status(500).send({ message: err.message });
    }

}

exports.delete = async (req, res) => {
    const id = req.params.id
    const password = req.body.password;

    try {
        console.log("tu jestem");
        const user = await User.findOne({ where: {id: id}});
        console.log("halo" + user);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );
        console.log(passwordIsValid);   
        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid password"
            });
        }
        await Habit.destroy({ 
            where: { userId: id } 
        });
        await Todo.destroy({
            where: { userId: id}
        })
        await User.destroy({
            where: { id: id }
        });
        res.send({ message: "User deleted successfully" });

    } catch(err) {
        res.status(500).send({message: err.message});
    }

    // User.destroy({
    //     where: {id: id}
    // })

    // .then(user => {
    //     var passwordIsValid = bcrypt.compareSync(
    //         req.body.password,
    //         user.password
    //     );
    //     if (!passwordIsValid) {
    //         return res.status(401).send({
    //             accessToken: null,
    //             message: "Invalid password"
    //         });
    //     }
    //     else {
    //         res.send({message: "User deleted successfully"});
    //     }
    //     // if (user == 1) {
    //     //     res.send({message: "User deleted successfully"})
    //     // }
    //     // else {
    //     //     res.send({message: `Cannot delete user with id ${id}. User probably wasn't found`});
    //     // }
    // })
    // .catch(err => {
    //     res.status(500).send({message: err.message + id})
    // })
}

exports.completeTask = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
            return;
        }
        user.tasksCompleted += 1;
        console.log("przed save");
        user.save();
        console.log("Tu jestem");
        const milestones = await Milestone.findAll({
            where: {
                userId: id,
                tasksRequired: user.tasksCompleted,
                isAchieved: false
            }
        });
        console.log(milestones);

        for (const milestone of milestones) {
            milestone.isAchieved = true;
            console.log(milestone);
            await milestone.save();
        }
        res.status(200).json({ message: "Task completed and milestones updated!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error updating milestones." });
    }
}

exports.updateThemes = async (req, res) => {
    const {userId, theme} = req.body;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        if (!user.purchasedThemes.includes(theme)) {
            const updatedThemes = [...user.purchasedThemes, theme];
            user.purchasedThemes = updatedThemes;
            await user.save();
        }
        res.status(200).send({ message: "Theme updated successfully." });
    } catch (err) {
        res.status(500).send({ message: "Server error"});
    }
}

exports.getUserGoods = async (req, res) => {
    const userId = req.params.id;
    
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        let userGoodsResponse = {
            coins: user.coins,
            purchasedThemes: user.purchasedThemes
        };
        return res.status(200).send(userGoodsResponse);
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
}
exports.updateCoins = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).send({message: "User not found."});
        }
        if (user.coins !== 0) {
            user.coins += req.body.coins;
        } else {
            user.coins = req.body.coins;
        }
        await user.save();
        return res.status(200).send({ message: "coins updated"});
    } catch (err) {
        res.status(500).send({ message: err.message});
    }
}

exports.updateQuest = async (req, res) => {
    const userId = req.params.id;
    const { dailyTodoCompleted, dailyHabitCompleted, coins } = req.body

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }
        if (dailyTodoCompleted !== undefined) {
            user.dailyTodo = dailyTodoCompleted;
        }
        if (dailyHabitCompleted !== undefined) {
            user.dailyHabit = dailyHabitCompleted;
        }
        if (user.coins !== 0) {
            user.coins += req.body.coins;
        } else {
            user.coins = req.body.coins;
        }
        await user.save();

        return res.status(200).send({ message: "Quest updated successfully.", user });
        
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: "An error occurred while updating the quest." });
    }
}


