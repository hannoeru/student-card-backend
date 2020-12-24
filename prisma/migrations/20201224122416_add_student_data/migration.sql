/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[studentNumber]` on the table `users`. If there are existing duplicate values, the migration will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "studentNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users.studentNumber_unique" ON "users"("studentNumber");
