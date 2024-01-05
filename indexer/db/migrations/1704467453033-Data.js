module.exports = class Data1704467453033 {
    name = 'Data1704467453033'

    async up(db) {
        await db.query(`ALTER TABLE "lobby" ADD "reservations_count" integer NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lobby" DROP COLUMN "reservations_count"`)
    }
}
