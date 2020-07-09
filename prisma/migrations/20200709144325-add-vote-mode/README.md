# Migration `20200709144325-add-vote-mode`

This migration has been generated at 7/9/2020, 2:43:25 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "quaint"."Vote" (
"id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,"linkId" INTEGER NOT NULL  ,"userId" INTEGER NOT NULL  ,FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE,
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE)

CREATE TABLE "quaint"."new_Link" (
"createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP ,"description" TEXT NOT NULL  ,"id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,"postedById" INTEGER   ,"url" TEXT NOT NULL  ,FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE)

INSERT INTO "quaint"."new_Link" ("createdAt", "description", "id", "postedById", "url") SELECT "createdAt", "description", "id", "postedById", "url" FROM "quaint"."Link"

PRAGMA foreign_keys=off;
DROP TABLE "quaint"."Link";;
PRAGMA foreign_keys=on

ALTER TABLE "quaint"."new_Link" RENAME TO "Link";

CREATE UNIQUE INDEX "quaint"."Vote.linkId_userId" ON "Vote"("linkId","userId")

PRAGMA "quaint".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200705150701-add-user-model..20200709144325-add-vote-mode
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -16,13 +16,25 @@
 	description String
 	url			String
 	postedBy	User?		@relation(fields: [postedById], references: [id])
 	postedById	Int?
+	votes		Vote[]
 }
 model User {
 	id 			Int			@id @default(autoincrement())
 	name		String
 	email		String		@unique
 	password	String
 	links		Link[]
+	votes		Vote[]
+}
+
+model Vote {
+	id 			Int 		@id @default(autoincrement())
+	link 		Link 		@relation(fields: [linkId], references: [id])
+	linkId 		Int
+	user 		User 		@relation(fields: [userId], references: [id])
+	userId 		Int
+
+	@@unique([linkId, userId])
 }
```


