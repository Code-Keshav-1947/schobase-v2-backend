/*
  Warnings:

  - A unique constraint covering the columns `[website]` on the table `School` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `establishedYear` to the `School` table without a default value. This is not possible if the table is not empty.
  - Added the required column `website` to the `School` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "School" ADD COLUMN     "establishedYear" INTEGER NOT NULL,
ADD COLUMN     "website" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "School_website_key" ON "School"("website");
