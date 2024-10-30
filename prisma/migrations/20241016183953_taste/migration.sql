-- CreateTable
CREATE TABLE "Taste" (
    "id" SERIAL NOT NULL,
    "level" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'use',

    CONSTRAINT "Taste_pkey" PRIMARY KEY ("id")
);
