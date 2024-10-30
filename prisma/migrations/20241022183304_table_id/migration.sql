-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_tableId_fkey";

-- AlterTable
ALTER TABLE "OrderItem" ALTER COLUMN "tableId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "Table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
