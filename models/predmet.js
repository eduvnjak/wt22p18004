const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Predmet = sequelize.define("predmet", {
        naziv: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false
        },
        brojPredavanjaSedmicno: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0
            },
            allowNull: false
        },
        brojVjezbiSedmicno: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0
            },
            allowNull: false
        },
    }, {
        name: {
            plural: 'predmeti',
            singular: 'predmet'
        },
        tableName: 'predmeti'
    })
    return Predmet;
};