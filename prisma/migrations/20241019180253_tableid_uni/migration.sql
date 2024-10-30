/*
  Warnings:

  - A unique constraint covering the columns `[tableId]` on the table `Table` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Table_tableId_key" ON "Table"("tableId");
