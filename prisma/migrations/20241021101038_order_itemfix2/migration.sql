/*
  Warnings:

  - You are about to drop the column `milkTypesId` on the `OrderItem` table. All the data in the column will be lost.
  - Added the required column `menuId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `milkId` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_milkTypesId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "milkTypesId",
ADD COLUMN     "menuId" INTEGER NOT NULL,
ADD COLUMN     "milkId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_milkId_fkey" FOREIGN KEY ("milkId") REFERENCES "Milk"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
