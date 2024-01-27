module.exports = class Data1706342014352 {
    name = 'Data1706342014352'

    async up(db) {
        await db.query(`ALTER TABLE "character" ADD "algorithm_id" text NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "character" DROP COLUMN "algorithm_id"`)
    }
}
