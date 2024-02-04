module.exports = class Data1705608899903 {
    name = 'Data1705608899903'

    async up(db) {
        await db.query(`CREATE TABLE "mint" ("id" character varying NOT NULL, "pool_amount" integer NOT NULL, CONSTRAINT "PK_fcaea791104aa41aa11dac29cb2" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "character" ADD "balance" integer NOT NULL`)
    }

    async down(db) {
        await db.query(`DROP TABLE "mint"`)
        await db.query(`ALTER TABLE "character" DROP COLUMN "balance"`)
    }
}
