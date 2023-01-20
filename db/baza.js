const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password", {
    host: "localhost",
    dialect: "mysql",
    logging: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela
db.nastavnik = require("../models/nastavnik.js")(sequelize);
db.predmet = require("../models/predmet.js")(sequelize);
db.student = require("../models/student.js")(sequelize);
db.prisustvo = require("../models/prisustvo.js")(sequelize);


db.nastavnik.belongsToMany(db.predmet, { through: "NastavnikPredmet" });
db.predmet.belongsToMany(db.nastavnik, { through: "NastavnikPredmet" });

db.student.belongsToMany(db.predmet, { through: "StudentPredmet" });
db.predmet.belongsToMany(db.student, { through: "StudentPredmet" });

db.predmet.hasMany(db.prisustvo, { foreignKey: { allowNull: false } });
db.prisustvo.belongsTo(db.predmet, {
    foreignKey: { unique: "composite" },
    onDelete: 'CASCADE'
});

//ovdje moze foreign key i studentId
db.prisustvo.belongsTo(db.student, {
    targetKey: "index",
    foreignKey: {
        name: "index",
        allowNull: false,
        unique: "composite"
    },
    onDelete: 'CASCADE'
});
// da li da postavim comoposite key umjesto primary keya

module.exports = db;