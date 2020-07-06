const Sequelize = require("sequelize")
const connection = new Sequelize('qaperguntas', 'root', 'fortcamp0100', {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection;