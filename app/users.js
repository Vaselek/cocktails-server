const express = require('express');
// const path = require('path');
// const multer = require('multer');
const nanoid = require('nanoid');
const config = require('../config');
const axios = require('axios');

const User = require('../models/User');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, config.uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, nanoid() + path.extname(file.originalname))
//     }
// });
//
// const upload = multer({storage});
//
const router = express.Router();
//
// router.post('/', upload.single('avatar'), (req, res) => {
//     const userData = {
//         username: req.body.username,
//         displayName: req.body.displayName,
//         password: req.body.password
//
//     };
//     if (req.file) {
//         userData.avatar = req.file.filename;
//     }
//
//     const user = new User(userData);
//
//     user.generateToken();
//     user.save()
//         .then(user => res.send({message: 'User registered', user}))
//         .catch(error => res.status(400).send(error))
// });

// router.post('/sessions', async (req, res) => {
//     const user = await User.findOne({username: req.body.username});
//     if(!user) {
//         return res.status(400).send({error: 'Username not found'});
//     }
//     const isMatch = await user.checkPassword(req.body.password);
//     if (!isMatch) {
//         return res.status(400).send({error: 'Password is wrong'});
//     }
//     user.generateToken();
//     await user.save();
//     return res.send({message: 'Login successful', user})
// });

router.post('/facebookLogin', async (req, res) => {
    console.log(req.body.accessToken)
    const inputToken = req.body.accessToken;
    const accessToken = config.facebook.appId + '|' + config.facebook.appSecret;
    const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;
    try {
        const response = await axios.get(debugTokenUrl);
        console.log(response.data)
        if (response.data.data.error) {
            return res.status(401).send({message: 'Facebook token incorrect'});
        }
        console.log(111)

        if (req.body.id !== response.data.data.user_id) {
            return res.status(401).send({message: 'Wrong user ID'});
        }

        console.log(1111)
        let user = await User.findOne({facebookId: req.body.id});
        console.log(user)
        if (!user) {
            user = new User({
                username: req.body.email,
                password: nanoid(),
                facebookId: req.body.id,
                displayName: req.body.name,
            });
        }
        user.generateToken();
        await user.save();
        return res.send({message: 'Login or register successful', user});
    } catch (error) {
        console.log(error)
        return res.status(401).send({message: 'Facebook token incorrect'});
    }
});

module.exports = router;