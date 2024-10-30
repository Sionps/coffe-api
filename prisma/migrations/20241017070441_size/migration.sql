-- AlterTable
ALTER TABLE "Milk" ALTER COLUMN "status" SET DEFAULT 'use';

-- CreateTable
CREATE TABLE "Size" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "Size_pkey" PRIMARY KEY ("id")
);
