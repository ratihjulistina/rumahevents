/*
  Warnings:

  - Added the required column `no_invoice` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "no_invoice" TEXT NOT NULL,
ALTER COLUMN "payment_proof" DROP NOT NULL;
