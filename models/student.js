const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    const Student = sequelize.define("student", {
        ime: {
            type: Sequelize.STRING,
            allowNull: false
        },
        index: {
            type: Sequelize.INTEGER,
            unique: true,
            allowNull: false
        }
    }, {
        name: {
            singular: 'student',
            plural: 'studenti',
        },
        tableName: 'studenti'
    })
    return Student;
};