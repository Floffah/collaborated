-- CreateEnum
CREATE TYPE "ClientType" AS ENUM ('USER', 'BOT');

-- CreateEnum
CREATE TYPE "LimitType" AS ENUM ('CreateUser');

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "type" "ClientType" NOT NULL DEFAULT E'USER',
    "username" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LimitLog" (
    "id" SERIAL NOT NULL,
    "type" "LimitType" NOT NULL,
    "when" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clientId" INTEGER NOT NULL,

    PRIMARY KEY ("id","type")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "access" TEXT,
    "refresh" TEXT,
    "lastAccess" TIMESTAMP(3) NOT NULL DEFAULT '1970-01-01 00:00:00 +00:00',
    "expired" BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotUser" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,
    "token" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupMember" (
    "groupId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("groupId","userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clientId_unique" ON "User"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_clientId_unique" ON "BotUser"("clientId");

-- AddForeignKey
ALTER TABLE "GroupMember" ADD FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupMember" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotUser" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LimitLog" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
