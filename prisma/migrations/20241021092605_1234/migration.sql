/*
  Warnings:

  - You are about to drop the column `milkId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `milkTypesId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_milkId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "milkId",
ADD COLUMN     "milkTypesId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_milkTypesId_fkey" FOREIGN KEY ("milkTypesId") REFERENCES "Milk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
