/*
  Warnings:

  - The primary key for the `LimitLog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `LimitLog` table. All the data in the column will be lost.
  - Added the required column `fingerprint` to the `LimitLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LimitLog" DROP CONSTRAINT "LimitLog_pkey",
DROP COLUMN "id",
ADD COLUMN     "fingerprint" TEXT NOT NULL,
ADD PRIMARY KEY ("fingerprint", "type");

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastAccess" SET DEFAULT '1970-01-01 00:00:00 +00:00';
