module.exports = class Data1705944417775 {
    name = 'Data1705944417775'

    async up(db) {
        await db.query(`ALTER TABLE "lobby" ADD "started" boolean NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lobby" DROP COLUMN "started"`)
    }
}
