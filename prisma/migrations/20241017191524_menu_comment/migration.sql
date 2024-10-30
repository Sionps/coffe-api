/*
  Warnings:

  - Added the required column `comment` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Menu" ADD COLUMN     "comment" TEXT NOT NULL;
