/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[code]` on the table `schools`. If there are existing duplicate values, the migration will fail.
  - Added the required column `code` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "schools.code_unique" ON "schools"("code");
