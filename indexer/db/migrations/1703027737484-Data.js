module.exports = class Data1703027737484 {
    name = 'Data1703027737484'

    async up(db) {
        await db.query(`CREATE TABLE "character" ("id" character varying NOT NULL, "owner" text NOT NULL, "name" text NOT NULL, "attributes" jsonb NOT NULL, "level" integer NOT NULL, "experience" integer NOT NULL, CONSTRAINT "PK_6c4aec48c564968be15078b8ae5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c6462f0b6093bcbd477041e1bc" ON "character" ("owner") `)
        await db.query(`CREATE TABLE "lobby_character" ("id" character varying NOT NULL, "lobby_id" character varying, "character_id" character varying, CONSTRAINT "PK_92421fb1925e3d8be511a79bbc4" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f0be76caa8cd57b0f26c62720e" ON "lobby_character" ("lobby_id") `)
        await db.query(`CREATE INDEX "IDX_ebb3ecb2fa73840fa67a6f0cc0" ON "lobby_character" ("character_id") `)
        await db.query(`CREATE TABLE "lobby" ("id" character varying NOT NULL, CONSTRAINT "PK_0d9e681a820740df03d4ba784bd" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "lobby_character" ADD CONSTRAINT "FK_f0be76caa8cd57b0f26c62720e5" FOREIGN KEY ("lobby_id") REFERENCES "lobby"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "lobby_character" ADD CONSTRAINT "FK_ebb3ecb2fa73840fa67a6f0cc0f" FOREIGN KEY ("character_id") REFERENCES "character"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "character"`)
        await db.query(`DROP INDEX "public"."IDX_c6462f0b6093bcbd477041e1bc"`)
        await db.query(`DROP TABLE "lobby_character"`)
        await db.query(`DROP INDEX "public"."IDX_f0be76caa8cd57b0f26c62720e"`)
        await db.query(`DROP INDEX "public"."IDX_ebb3ecb2fa73840fa67a6f0cc0"`)
        await db.query(`DROP TABLE "lobby"`)
        await db.query(`ALTER TABLE "lobby_character" DROP CONSTRAINT "FK_f0be76caa8cd57b0f26c62720e5"`)
        await db.query(`ALTER TABLE "lobby_character" DROP CONSTRAINT "FK_ebb3ecb2fa73840fa67a6f0cc0f"`)
    }
}
