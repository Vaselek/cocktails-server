const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const tryAuth = require('../middleware/tryAuth');
const permit = require('../middleware/permit');

const Cocktail = require('../models/Cocktail');
const ObjectId = require('mongoose').Types.ObjectId;


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname))
    }
});

const upload = multer({storage});

const router = express.Router();

router.get('/', tryAuth, (req, res) => {
    let criteria = {published: true};

    if (req.user && req.user.role !== 'admin') {
        criteria = {
            $or: [
                {published: true},
                {user: req.user._id}
            ]
        }
    }

    Cocktail.find(criteria)
        .then(cocktails => res.send(cocktails))
        .catch(() => res.sendStatus(500))
});

router.get('/:id', (req, res) => {
    Cocktail.findById(req.params.id).populate('user')
        .then(result => {
            if (result) return res.send(result);
            res.sendStatus(404);
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/', tryAuth, upload.single('image'), (req, res) => {
    const cocktailData = {
        title: req.body.title,
        receipt: req.body.receipt,
        user: req.user,

    };

    if(req.body.ingredients) {
        cocktailData.ingredients = JSON.parse(req.body.ingredients)
    }

    if (req.file) {
        cocktailData.image = req.file.filename;
    }

    const cocktail = new Cocktail(cocktailData);
    cocktail.save()
        .then(result => res.send(result))
        .catch((error) => {
            console.log(error)
            res.sendStatus(400).send(error)
        })
});

router.delete('/:id', [tryAuth, permit('admin')], (req, res) => {
    Cocktail.findById(req.params.id)
        .then(cocktail => {
            cocktail.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/:id/publish', [tryAuth, permit('admin')], (req, res) => {
    Cocktail.findById(req.params.id)
        .then(cocktail => {
            cocktail.published = true;
            cocktail.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});


module.exports = router;
