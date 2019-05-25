const express = require('express');
const multer = require('multer');
const path = require('path');
const nanoid = require('nanoid');
const config = require('../config');
const auth = require('../middleware/auth');
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

router.get('/', (req, res) => {
    console.log('geet')
    // if (req.query.user)
    //     return Cocktail.find({user: new ObjectId(req.query.user)})
    //         .then(cocktails => res.send(cocktails))
    //         .catch(() => res.sendStatus(500))
    Cocktail.find()
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

router.post('/', auth, upload.single('image'), (req, res) => {
    const cocktailData = {
        title: req.body.title,
        receipt: req.body.receipt,
        user: req.user,

    };
    console.log(req.body.ingredients)
    console.log(JSON.parse(req.body.ingredients))

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

router.delete('/:id', [auth, permit('admin')], (req, res) => {
    Cocktail.findById(req.params.id)
        .then(cocktail => {
            cocktail.delete();
            return res.send({message: 'Deleted'});
        })
        .catch(()=>res.sendStatus(500))
});

router.post('/:id/publish', [auth, permit('admin')], (req, res) => {
    Cocktail.findById(req.params.id)
        .then(cocktail => {
            cocktail.published = true;
            cocktail.save();
            return res.send({message: 'Published'});
        })
        .catch(()=>res.sendStatus(500))
});


module.exports = router;
