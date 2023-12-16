module.exports = class Data1702767178180 {
    name = 'Data1702767178180'

    async up(db) {
        await db.query(`CREATE TABLE "character" ("id" character varying NOT NULL, "owner" text NOT NULL, "name" text NOT NULL, "attributes" jsonb NOT NULL, "level" integer NOT NULL, "experience" integer NOT NULL, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c6462f0b6093bcbd477041e1bc" ON "character" ("owner") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "character"`)
        await db.query(`DROP INDEX "public"."IDX_c6462f0b6093bcbd477041e1bc"`)
    }
}
