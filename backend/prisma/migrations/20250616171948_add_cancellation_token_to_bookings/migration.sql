/*
  Warnings:

  - A unique constraint covering the columns `[cancellation_token]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "cancellation_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_cancellation_token_key" ON "Booking"("cancellation_token");
