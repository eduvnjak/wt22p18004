const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt22", "root", "password", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

//import modela
db.nastavnik = require("./nastavnik.js")(sequelize);
db.predmet = require("./predmet.js")(sequelize);
db.student = require("./student.js")(sequelize);
db.prisustvo = require("./prisustvo.js")(sequelize);


db.nastavnik.belongsToMany(db.predmet, { through: "NastavnikPredmet" });
db.predmet.belongsToMany(db.nastavnik, { through: "NastavnikPredmet" });

db.student.belongsToMany(db.predmet, { through: "StudentPredmet" });
db.predmet.belongsToMany(db.student, { through: "StudentPredmet" });

db.predmet.hasMany(db.prisustvo, { foreignKey: { allowNull: false } });
db.prisustvo.belongsTo(db.predmet, {
    foreignKey: { unique: "composite" }
});

//ovdje moze foreign key i studentId
db.prisustvo.belongsTo(db.student, {
    targetKey: "index",
    foreignKey: {
        name: "studentIndex",
        allowNull: false,
        unique: "composite"
    }
});
//da li da postavim comoposite key umjesto primary keya

// console.log(Object.getOwnPropertyNames(db.predmet));
// console.log(db.predmet.prototype);
// console.log(db.prisustvo.prototype);

module.exports = db;