# Migration `20200705150701-add-user-model`

This migration has been generated at 7/5/2020, 3:07:01 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "quaint"."User" (
"email" TEXT NOT NULL  ,"id" INTEGER NOT NULL  PRIMARY KEY AUTOINCREMENT,"name" TEXT NOT NULL  ,"password" TEXT NOT NULL  )

ALTER TABLE "quaint"."Link" ADD COLUMN "postedById" INTEGER   ;

CREATE UNIQUE INDEX "quaint"."User.email" ON "User"("email")

PRAGMA "quaint".foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200704080656-init..20200705150701-add-user-model
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
@@ -14,5 +14,15 @@
 	id			Int			@id @default(autoincrement())
 	createdAt 	DateTime 	@default(now())
 	description String
 	url			String
+	postedBy	User?		@relation(fields: [postedById], references: [id])
+	postedById	Int?
+}
+
+model User {
+	id 			Int			@id @default(autoincrement())
+	name		String
+	email		String		@unique
+	password	String
+	links		Link[]
 }
```


