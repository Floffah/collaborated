/*
  Warnings:

  - You are about to drop the column `clientId` on the `LimitLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LimitLog" DROP CONSTRAINT "LimitLog_clientId_fkey";

-- AlterTable
ALTER TABLE "LimitLog" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastAccess" SET DEFAULT '1970-01-01 00:00:00 +00:00';
