/*
  Warnings:

  - The migration will add a unique constraint covering the columns `[user_id]` on the table `student_id_cards`. If there are existing duplicate values, the migration will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "student_id_cards_user_id_unique" ON "student_id_cards"("user_id");
