-- CreateTable
CREATE TABLE "BotUser" (
    "id" SERIAL NOT NULL,
    "clientId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BotUser_clientId_unique" ON "BotUser"("clientId");

-- AddForeignKey
ALTER TABLE "BotUser" ADD FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;
