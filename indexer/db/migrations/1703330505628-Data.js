module.exports = class Data1703330505628 {
    name = 'Data1703330505628'

    async up(db) {
        await db.query(`ALTER TABLE "lobby" ADD "capacity" integer NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "lobby" DROP COLUMN "capacity"`)
    }
}
