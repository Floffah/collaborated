-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('USER', 'BOT');

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "type" "ClientType" NOT NULL DEFAULT E'USER';

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_unique" ON "User"("clientId");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
