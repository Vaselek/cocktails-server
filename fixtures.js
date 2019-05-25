const mongoose = require('mongoose');
const nanoid = require('nanoid');

const config = require('./config');

const Cocktail = require('./models/Cocktail');
const User = require('./models/User');

const run = async () => {
    await mongoose.connect(config.dbUrl, config.mongoOptions);

    const connection = mongoose.connection;

    const collections = await connection.db.collections();

    for (let collection of collections) {
        await collection.drop();
    }

    const [user, admin] = await User.create({
        username: 'new_okpuasx_user@tfbnw.net',
        password: '123!#lol#!',
        role: 'user',
        token: nanoid(),
        displayName: 'John'
    }, {
        username: 'open_xvxidsd_user@tfbnw.net',
        password: '123!#lol#!',
        role: 'admin',
        token: nanoid(),
        displayName: 'Main'
    });


    await Cocktail.create(
        {
            title: 'First cocktail',
            receipt: 'First cocktail',
            image: "",
            user: user._id,
            isPublished: true,
            ingredients: [{name: 'milk'}, {quantitly: '1ml'}]
        },
        {
            title: 'Second cocktail',
            receipt: 'Second cocktail',
            image: "",
            user: admin._id,
            isPublished: false,
            ingredients: [{name: 'milk'}, {quantitly: '1ml'}]
        },
    );
    return connection.close();
};


run().catch(error => {
    console.error('Something wrong happened...', error);
});
