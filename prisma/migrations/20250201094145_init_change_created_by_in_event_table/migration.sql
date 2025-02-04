/*
  Warnings:

  - You are about to drop the column `email` on the `organizers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_created_by_fkey";

-- AlterTable
ALTER TABLE "organizers" DROP COLUMN "email",
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "website" DROP NOT NULL,
ALTER COLUMN "instagram" DROP NOT NULL,
ALTER COLUMN "banner_image" DROP NOT NULL,
ALTER COLUMN "profile_image" DROP NOT NULL,
ALTER COLUMN "address_line" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
