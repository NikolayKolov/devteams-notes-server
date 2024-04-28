/*
  Warnings:

  - Added the required column `order` to the `NoteChecklistItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NoteChecklistItems" ADD COLUMN     "order" INTEGER NOT NULL;
