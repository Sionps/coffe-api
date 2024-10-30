/*
  Warnings:

  - You are about to drop the `_MenuMilk` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_MenuMilk" DROP CONSTRAINT "_MenuMilk_A_fkey";

-- DropForeignKey
ALTER TABLE "_MenuMilk" DROP CONSTRAINT "_MenuMilk_B_fkey";

-- DropTable
DROP TABLE "_MenuMilk";

-- CreateTable
CREATE TABLE "Temperature" (
    "id" SERIAL NOT NULL,
    "temperature" TEXT NOT NULL,

    CONSTRAINT "Temperature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuMilks" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuTemperatures" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MenuMilks_AB_unique" ON "_MenuMilks"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuMilks_B_index" ON "_MenuMilks"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuTemperatures_AB_unique" ON "_MenuTemperatures"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuTemperatures_B_index" ON "_MenuTemperatures"("B");

-- AddForeignKey
ALTER TABLE "_MenuMilks" ADD CONSTRAINT "_MenuMilks_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuMilks" ADD CONSTRAINT "_MenuMilks_B_fkey" FOREIGN KEY ("B") REFERENCES "Milk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuTemperatures" ADD CONSTRAINT "_MenuTemperatures_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuTemperatures" ADD CONSTRAINT "_MenuTemperatures_B_fkey" FOREIGN KEY ("B") REFERENCES "Temperature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
