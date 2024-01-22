const User = require("../models/user");
const Collector = require("../models/collector");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config();
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

//cloudinary
cloudinary.config({
    cloud_name: 'duvw77iju',
    api_key: '765921676642255',
    api_secret: 'eVZIIYHsIh9KnoaACpOjEG0LfhE'
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
        user: "ecotracksolutions@gmail.com",
        pass: process.env.APP_PASSWORD
    }
});

const sendEmail = (req, res) => {
    try {
        const { name, email, message } = req.body;

        transporter.sendMail({
            from: "ecotracksolutions@gmail.com",
            to: "ecotracksolutions@gmail.com",
            subject: "Message from Visitor",
            text:`Hello,

            You have received a message from ${name} (${email}).
    
            Message:
            ${message}
    
            Regards,
            ${name}`,
            html: `<p>Hello,</p>
    
            <p>You have received a message from <strong>${name}</strong> (${email}).</p>
    
            <p>Message:<br>
            ${message}</p>
    
            <p>Regards,<br>
            ${name}</p>`

        }, (error, info) => {
            if (error) {
                console.log('Error sending email:', error);
                return res.status(500).json({ error: 'Error sending email' });
            } else {
                console.log(`Email sent: ${info.response}`);
                res.status(200).json({ 
                    message: "Email Submitted! We'll get right back to you very soon.",  
                });
            }
        });
    } catch(error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Error sending email' });
    }
}

const updateUserAccount = (req, res) => {
    const token = req.cookies.authToken;
    const { name, email, password, phoneNumber } = req.body;
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            console.error("Token:", token);
            return res.json({
                Status: "Error with token"
            });
        } else {
            User.findById(decoded.id)
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                const update = {};
                if (name && name !== user.name) update.name = name;
                if (password && password.length >= 6) {
                    const isEqual = bcrypt.compareSync(password, user.password);
                    if(!isEqual){
                        update.password = bcrypt.hashSync(password, 12);
                    }
                }
                if (email && email !== user.email) update.email = email;
                if (phoneNumber && phoneNumber !== user.phoneNumber) update.phoneNumber = phoneNumber;

                if (Object.keys(update).length > 0) {
                    User.findByIdAndUpdate(user._id, update, { new: true })
                    .then(updatedUser => res.json(updatedUser))
                    .catch(err => res.status(500).json({ message: 'Server Error', err }));
                } else {
                    return res.status(400).json({ message: 'No changes detected' });
                }
            })
            .catch(err => {
                console.error(err.message);
                res.status(500).json({
                    message: "Server Error", err: err.message
                });
            })
        }
    });
};

const uploadAvatar = async (req, res) => {
    const token = req.cookies.authToken;
    const imageUrl = req.body.img; 
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.avatar = String(imageUrl); // Update the avatar field

        try {
            await user.save();
            res.json({
                message: 'Avatar updated!',
                avatar: user.avatar,
            });
        } catch (error) {
            console.error('Error saving user:', error);
            return res.status(500).json({ message: 'Error saving user' });
        }

    } catch (err) {
        console.error('Error updating avatar:', err);
        return res.status(500).json({ message: 'Error updating avatar' });
    }
};
    
const displayAvatar = async (req, res) => {
    const token = req.cookies.authToken;

    if (!token) return res.status(401).json({ message: "No token provided"});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({ message: "Token expired" })
            }
            console.error("JWT verification error", err);
            return res.status(403).json({ message: "Token verification failed" })
        }

        User.findById(user.id)
            .then(user => {
                const publicId = user.avatar; // Assuming the avatar field stores the publicId of the image

                // Generate the Cloudinary URL for the image
                const avatarUrl = cloudinary.url(publicId, {
                    secure: true,
                    width: 128,
                    height: 'auto', 
                    crop: 'cover'
                });

                res.redirect(avatarUrl);
            })
            .catch(err => res.status(500).json({ message: "Error: " + err }));
    });
};

const updateAddress = async (req, res) => {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    try {
        const user = await User.findByIdAndUpdate(userId, {
            $set: {
                address: req.body
            }
        }, { new: true });
        res.json(user);
    } catch (error) {
        res.status(500).json({
            error: error.toString()
        })
    }
};

const submitFeedback = async (req, res) => {
    try {
        const token = req.cookies.authToken;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const name = user.name;
        const email = user.email;
        const { frequency, mostUsedFeature, improvementSuggestion, motivation } = req.body;
        
        try {
            transporter.sendMail({
                from: "ecotracksolutions@gmail.com",
                to: "ecotracksolutions@gmail.com",
                subject: `Feedback from user: ${name}.`,
                text: `Hello,
                
                You have received feedback from ${name} (${email}).
                
                Frequency: ${frequency}
                Most Used Feature: ${mostUsedFeature}
                Improvement Suggestion: ${improvementSuggestion}
                Motivation: ${motivation}
                
                Regards,
                ${name}`,
                html: `<p>Hello,</p>
                
                <p>You have received feedback from <strong>${name}</strong> (${email}).</p>
                
                <p>Frequency: ${frequency}</p>
                <p>Most Used Feature: ${mostUsedFeature}</p>
                <p>Improvement Suggestion: ${improvementSuggestion}</p>
                <p>Motivation: ${motivation}</p>
                
                <p>Regards,<br>
                ${name}</p>`
            }, (error, info) => {
                if (error) {
                    res.status(500).json({ message: 'Error sending email' });
                    console.log('Error sending email', error)
                } else {
                    res.status(200).json({ message: 'Email sent' });
                    console.log('Email sent:', info.response);
                }
            });
        } catch(error) {
            console.error('Error sending email:', error);
        }
    } catch (error) {
        // Handle any errors that occurred during processing
        console.error('Error submitting feedback:', error);
        res.status(500).json({ message: 'Error submitting feedback' });
    }
};

const getCollectors = async (req, res) => {
    try {
        // Retrieve all collectors from the database
        const collectors = await Collector.find();
    
        // Return the collectors as the response
        res.json(collectors);
    } catch (error) {
        console.error('Failed to retrieve collectors', error);
        res.status(500).json({ error: 'Failed to retrieve collectors' });
    }
}

module.exports = {
    sendEmail,
    updateUserAccount,
    uploadAvatar,
    displayAvatar,
    updateAddress,
    submitFeedback,
    getCollectors
}