-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expired" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "lastAccess" SET DEFAULT '1970-01-01 00:00:00 +00:00';