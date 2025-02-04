/*
  Warnings:

  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `full_name` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `profile_picture` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `referred_by` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `_CatagoryToEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `catagories` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `category` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payment_proof` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CatagoryToEvent" DROP CONSTRAINT "_CatagoryToEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_CatagoryToEvent" DROP CONSTRAINT "_CatagoryToEvent_B_fkey";

-- DropIndex
DROP INDEX "users_referral_code_key";

-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "category" VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "payment_proof" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "deleted_at",
DROP COLUMN "full_name",
DROP COLUMN "phone_number",
DROP COLUMN "profile_picture",
DROP COLUMN "referral_code",
DROP COLUMN "referred_by",
DROP COLUMN "updated_at",
DROP COLUMN "username",
ADD COLUMN     "first_name" VARCHAR(100) NOT NULL,
ADD COLUMN     "img_src" TEXT,
ADD COLUMN     "last_name" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "_CatagoryToEvent";

-- DropTable
DROP TABLE "catagories";
