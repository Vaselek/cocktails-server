const path = require('path');
const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    mongoOptions: {useNewUrlParser: true},
    dbUrl: 'mongodb://localhost/cocktails',
    facebook: {
        appId: '2140335342732357',
        appSecret: 'cdfe5ae0d44dad6eb0463cb6afdf9b20'
    }
}