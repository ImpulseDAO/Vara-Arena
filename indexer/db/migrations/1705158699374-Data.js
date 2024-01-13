module.exports = class Data1705158699374 {
    name = 'Data1705158699374'

    async up(db) {
        await db.query(`CREATE TABLE "mint" ("id" character varying NOT NULL, "pool_amount" integer NOT NULL, CONSTRAINT "PK_fcaea791104aa41aa11dac29cb2" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "mint"`)
    }
}
