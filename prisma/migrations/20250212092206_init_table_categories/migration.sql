/*
  Warnings:

  - You are about to drop the column `category` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "category";

-- CreateTable
CREATE TABLE "catagories" (
    "id" SERIAL NOT NULL,
    "catagory_name" VARCHAR(255) NOT NULL,

    CONSTRAINT "catagories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CatagoryToEvent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CatagoryToEvent_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CatagoryToEvent_B_index" ON "_CatagoryToEvent"("B");

-- AddForeignKey
ALTER TABLE "_CatagoryToEvent" ADD CONSTRAINT "_CatagoryToEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "catagories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CatagoryToEvent" ADD CONSTRAINT "_CatagoryToEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
