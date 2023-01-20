const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Prisustvo = sequelize.define("prisustvo", {
        sedmica: {
            type: Sequelize.INTEGER,
            unique: "composite",
            validate: {
                min: 1,
                max: 15
            },
            allowNull: false
        },
        // //da li da ovaj index povezem sa tabelom studenti
        // index: {
        //     type: Sequelize.INTEGER,
        //     unique: "composite"
        // },
        predavanja: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0
            },
            allowNull: false
        },
        vjezbe: {
            type: Sequelize.INTEGER,
            validate: {
                min: 0
            },
            allowNull: false
        },
    }, {
        name: {
            singular: 'prisustvo',
            plural: 'prisustva',
        },
        tableName: 'prisustva'
    })
    return Prisustvo;
};