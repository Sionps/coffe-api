/*
  Warnings:

  - You are about to drop the column `menuId` on the `OrderItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_menuId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "menuId";
