-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MenuSize" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuMilk" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_MenuTaste" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_MenuSize_AB_unique" ON "_MenuSize"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuSize_B_index" ON "_MenuSize"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuMilk_AB_unique" ON "_MenuMilk"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuMilk_B_index" ON "_MenuMilk"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MenuTaste_AB_unique" ON "_MenuTaste"("A", "B");

-- CreateIndex
CREATE INDEX "_MenuTaste_B_index" ON "_MenuTaste"("B");

-- AddForeignKey
ALTER TABLE "_MenuSize" ADD CONSTRAINT "_MenuSize_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuSize" ADD CONSTRAINT "_MenuSize_B_fkey" FOREIGN KEY ("B") REFERENCES "Size"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuMilk" ADD CONSTRAINT "_MenuMilk_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuMilk" ADD CONSTRAINT "_MenuMilk_B_fkey" FOREIGN KEY ("B") REFERENCES "Milk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuTaste" ADD CONSTRAINT "_MenuTaste_A_fkey" FOREIGN KEY ("A") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MenuTaste" ADD CONSTRAINT "_MenuTaste_B_fkey" FOREIGN KEY ("B") REFERENCES "Taste"("id") ON DELETE CASCADE ON UPDATE CASCADE;
