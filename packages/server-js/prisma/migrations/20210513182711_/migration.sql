/*
  Warnings:

  - The primary key for the `PersistedQuery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[hash]` on the table `PersistedQuery` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "PersistedQuery" DROP CONSTRAINT "PersistedQuery_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "PersistedQuery.hash_unique" ON "PersistedQuery"("hash");
