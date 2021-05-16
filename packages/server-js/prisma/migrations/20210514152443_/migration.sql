-- AlterTable
ALTER TABLE "BotUser" ADD COLUMN     "token" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "access" TEXT,
ADD COLUMN     "refresh" TEXT,
ADD COLUMN     "lastAccess" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00';
