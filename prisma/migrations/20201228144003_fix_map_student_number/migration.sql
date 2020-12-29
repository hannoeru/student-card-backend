/*
  Warnings:

  - You are about to drop the column `studentNumber` on the `student_id_cards` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[student_number]` on the table `student_id_cards`. If there are existing duplicate values, the migration will fail.
  - Added the required column `student_number` to the `student_id_cards` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "student_id_cards.studentNumber_unique";

-- AlterTable
ALTER TABLE "student_id_cards" DROP COLUMN "studentNumber",
ADD COLUMN     "student_number" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "student_id_cards.student_number_unique" ON "student_id_cards"("student_number");
