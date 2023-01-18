const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Nastavnik = sequelize.define("nastavnik", {
        username: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        password_hash: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            name: {
                singular: 'nastavnik',
                plural: 'nastavnici',
            },
            tableName: 'nastavnici'
        })
    return Nastavnik;
};