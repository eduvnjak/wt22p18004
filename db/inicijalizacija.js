const db = require('./baza.js');

db.sequelize.sync({ force: true }).then(async () => {
    // nastavnici 
    const nastavnik1 = await db.sequelize.models.nastavnik.create({
        username: "nastavnik1",
        password_hash: "$2b$10$wXWtCFWiJa27KQ25QEaGseWXfaFHoJDWktNAHJ.25BzeyPP8JK7vW"
    });
    const nastavnik2 = await db.sequelize.models.nastavnik.create({
        username: "nastavnik2",
        password_hash: "$2b$10$VNTkYkaQAHBgLeWqjDh27e33EIlB6No5kzwLzP989sNoamcmYbx2K"
    });
    const nastavnik3 = await db.sequelize.models.nastavnik.create({
        username: "nastavnik3",
        password_hash: "$2b$10$9JKWzbWPXxyrN1JD8VNJWOM9GAi68M4OheSCxRatIomyNjhVq7jvG"
    });
    const nastavnik4 = await db.sequelize.models.nastavnik.create({
        username: "nastavnik4",
        password_hash: "$2b$10$ZkJ2pwN..iAE/Iwd1WLZielmI/dW1pgEWHWgB1LcAfxBqZB8rbyES"
    });
    // predmeti
    const rma = await db.sequelize.models.predmet.create({
        naziv: "Razvoj mobilnih aplikacija",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 5
    });
    const wt = await db.sequelize.models.predmet.create({
        naziv: "Web tehnologije",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 2
    });
    const dm = await db.sequelize.models.predmet.create({
        naziv: "Diskretna matematika",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 3
    });
    const rpr = await db.sequelize.models.predmet.create({
        naziv: "Razvoj programskih rješenja",
        brojPredavanjaSedmicno: 2,
        brojVjezbiSedmicno: 4
    });
    const tp = await db.sequelize.models.predmet.create({
        naziv: "Tehnike programiranja",
        brojPredavanjaSedmicno: 3,
        brojVjezbiSedmicno: 3
    });
    const sp = await db.sequelize.models.predmet.create({
        naziv: "Sistemsko programiranje",
        brojPredavanjaSedmicno: 2,
        brojVjezbiSedmicno: 1
    });
    // studenti
    const student1 = await db.sequelize.models.student.create({
        ime: "student1",
        index: 12345
    });
    const student2 = await db.sequelize.models.student.create({
        ime: "student2",
        index: 12346
    });
    const student3 = await db.sequelize.models.student.create({
        ime: "student3",
        index: 12347
    });
    const student4 = await db.sequelize.models.student.create({
        ime: "student4",
        index: 12348
    });
    const student5 = await db.sequelize.models.student.create({
        ime: "student5",
        index: 12349
    });
    const student6 = await db.sequelize.models.student.create({
        ime: "student6",
        index: 12350
    });
    const student7 = await db.sequelize.models.student.create({
        ime: "student7",
        index: 12351
    });
    const student8 = await db.sequelize.models.student.create({
        ime: "student8",
        index: 12352
    });
    const student9 = await db.sequelize.models.student.create({
        ime: "student9",
        index: 12353
    });
    const student10 = await db.sequelize.models.student.create({
        ime: "student10",
        index: 12354
    });
    // nastavnici i predmeti
    await nastavnik1.addPredmeti([rma, wt]);
    await nastavnik2.addPredmeti([wt, dm]);
    await nastavnik3.addPredmeti([rpr]);
    await nastavnik4.addPredmeti([tp, sp]);
    // predmeti i studenti
    await rma.addStudenti([student1, student2, student3]);
    await wt.addStudenti([student1, student2, student3]);
    await dm.addStudenti([student4, student5, student6]);
    await rpr.addStudenti([student4, student5, student6]);
    await tp.addStudenti([student7, student8, student9, student10]);
    // prisustva
    // za rma
    await db.sequelize.models.prisustvo.create({
        sedmica: 13,
        predavanja: 2,
        vjezbe: 2,
        predmetId: rma.id,
        studentIndex: student1.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 13,
        predavanja: 2,
        vjezbe: 2,
        predmetId: rma.id,
        studentIndex: student2.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 14,
        predavanja: 2,
        vjezbe: 0,
        predmetId: rma.id,
        studentIndex: student1.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 14,
        predavanja: 0,
        vjezbe: 0,
        predmetId: rma.id,
        studentIndex: student2.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 15,
        predavanja: 1,
        vjezbe: 1,
        predmetId: rma.id,
        studentIndex: student2.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 12,
        predavanja: 2,
        vjezbe: 1,
        predmetId: rma.id,
        studentIndex: student1.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 15,
        predavanja: 0,
        vjezbe: 2,
        predmetId: rma.id,
        studentIndex: student1.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 15,
        predavanja: 1,
        vjezbe: 2,
        predmetId: rma.id,
        studentIndex: student3.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 14,
        predavanja: 1,
        vjezbe: 1,
        predmetId: rma.id,
        studentIndex: student3.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 13,
        predavanja: 1,
        vjezbe: 0,
        predmetId: rma.id,
        studentIndex: student3.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 11,
        predavanja: 3,
        vjezbe: 4,
        predmetId: rma.id,
        studentIndex: student2.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 12,
        predavanja: 1,
        vjezbe: 0,
        predmetId: rma.id,
        studentIndex: student2.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 12,
        predavanja: 0,
        vjezbe: 1,
        predmetId: rma.id,
        studentIndex: student3.index
    });
    // za wt
    await db.sequelize.models.prisustvo.create({
        sedmica: 1,
        predavanja: 2,
        vjezbe: 2,
        predmetId: wt.id,
        studentIndex: student1.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 2,
        predavanja: 3,
        vjezbe: 1,
        predmetId: wt.id,
        studentIndex: student2.index
    });
    //za dm
    await db.sequelize.models.prisustvo.create({
        sedmica: 1,
        predavanja: 2,
        vjezbe: 2,
        predmetId: dm.id,
        studentIndex: student4.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 2,
        predavanja: 3,
        vjezbe: 1,
        predmetId: dm.id,
        studentIndex: student4.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 1,
        predavanja: 2,
        vjezbe: 2,
        predmetId: dm.id,
        studentIndex: student5.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 2,
        predavanja: 3,
        vjezbe: 1,
        predmetId: dm.id,
        studentIndex: student5.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 1,
        predavanja: 2,
        vjezbe: 2,
        predmetId: dm.id,
        studentIndex: student6.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 3,
        predavanja: 3,
        vjezbe: 1,
        predmetId: dm.id,
        studentIndex: student5.index
    });
    // za rpr
    await db.sequelize.models.prisustvo.create({
        sedmica: 1,
        predavanja: 1,
        vjezbe: 1,
        predmetId: rpr.id,
        studentIndex: student5.index
    });
    // za tp
    await db.sequelize.models.prisustvo.create({
        sedmica: 5,
        predavanja: 1,
        vjezbe: 1,
        predmetId: tp.id,
        studentIndex: student7.index
    });
    await db.sequelize.models.prisustvo.create({
        sedmica: 4,
        predavanja: 3,
        vjezbe: 3,
        predmetId: tp.id,
        studentIndex: student10.index
    });
    process.exit();
})