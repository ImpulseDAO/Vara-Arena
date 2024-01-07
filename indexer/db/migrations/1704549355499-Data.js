module.exports = class Data1704549355499 {
    name = 'Data1704549355499'

    async up(db) {
        await db.query(`ALTER TABLE "character" ADD "rating" integer NOT NULL`)
        await db.query(`ALTER TABLE "character" ADD "lives_count" integer NOT NULL`)
        await db.query(`ALTER TABLE "lobby" ADD "tier" integer NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "character" DROP COLUMN "rating"`)
        await db.query(`ALTER TABLE "character" DROP COLUMN "lives_count"`)
        await db.query(`ALTER TABLE "lobby" DROP COLUMN "tier"`)
    }
}
