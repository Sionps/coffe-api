-- CreateTable
CREATE TABLE "Milk" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Milk_pkey" PRIMARY KEY ("id")
);
