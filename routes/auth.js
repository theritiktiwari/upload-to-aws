const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../model/users');
const mailSender = require("../config/mailer");
const fetchUser = require("../middleware/fetchUser");

// ROUTE 1 - Create a user with endpoint (POST : '/register').
router.post("/register", [
    body('firstname', "Name should be of 3 characters").isLength({ min: 3 }),
    body('lastname', "Name should be of 3 characters").isLength({ min: 3 }),
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password should be of 8 characters").isLength({ min: 8 }),
    body('age', "Age should be a number").isNumeric(),
    body('city', "City should not be null").notEmpty()
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    try {
        const { firstname, lastname, email, password, age, city, url } = req.body;
        // Check if the user exist
        let user = await User.findOne({ email: email });
        if (user) {
            return res.status(409).json({
                type: "error",
                message: "User already exists."
            });
        }

        const hashPass = await argon2.hash(password);
        // Send value in Database
        user = await User.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashPass,
            age: age,
            city: city
        })
        const user_data = {
            user: {
                id: user.id
            }
        }
        // If user created successfully, then send a mail to user
        if (user_data) {
            let mail_data = `Hi ${firstname}, <br> <br> Welcome to the family. <br> <br> Please verify your email by clicking on the link below. <br> <br> <a href="${url}/code=${user.verificationCode}&user=${user.id}">Verify Email</a> <br> <br> <b>Regards, ${process.env.MAIL_SENDER_NAME}</b>`;
            let mailsent = mailSender(email, "Account verification", mail_data);
            const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);
            // If mail sent successfully, then send a response to user
            if (mailsent && authToken) {
                res.status(200).json({
                    type: "success",
                    message: "Account created successfully, please verify your account.",
                    data: authToken
                });
            } else {
                res.status(500).json({
                    type: "error",
                    message: "Something went wrong."
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            type: "error",
            message: "Something went wrong.",
            // message: err.message
        });
    }
});

// ROUTE 2 - Authenticate a user with endpoint (POST : '/login')
router.post('/login', [
    body('email', "Enter a valid Email").isEmail(),
    body('password', "Password can't be blank").exists()
], async (req, res) => {
    // Return bad requests for errors
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({
            type: "error",
            message: error.array()
        });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        const passwordCompare = await argon2.verify(user.password, password);
        if (!passwordCompare) {
            return res.status(400).json({
                type: "error",
                message: "Invalid Credentials."
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                type: "error",
                message: "Please verify your email."
            });
        }

        const user_data = {
            user: {
                id: user.id
            }
        }
        const authToken = jwt.sign(user_data, process.env.JWT_SECRET_KEY);
        res.status(200).json({
            type: "success",
            message: "Login successfully.",
            data: authToken
        });

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 3 - Get loggedin user details with endpoint (POST : '/getuser')
router.post('/getuser', fetchUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json({
            type: "success",
            message: "User details fetched successfully.",
            data: user
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

// ROUTE 4 - Verify the user account with endpoint (POST : '/verify')
router.post('/verify', async (req, res) => {
    try {
        const { code, user_id } = req.body;
        const user = await User.findById(user_id);
        if (!user)
            return res.status(400).json({
                type: "error",
                message: "Could not verify user."
            });

        if (user.verified)
            return res.status(400).json({
                type: "error",
                message: "User already verified."
            });

        if (user.verificationCode === code) {
            user.verified = true;
            // user.verificationCode = null;
            await user.save();

            res.status(200).json({
                type: "success",
                message: "User verified successfully."
            });
        } else {
            res.status(400).json({
                type: "error",
                message: "Could not verify user."
            });
        }

    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            type: "error",
            message: "Something went wrong."
        });
    }
});

module.exports = router;