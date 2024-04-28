/*
  Warnings:

  - You are about to drop the column `passHash` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `passSalt` on the `User` table. All the data in the column will be lost.
  - Added the required column `passSaltHash` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Note" DROP CONSTRAINT "Note_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "NoteChecklistItems" DROP CONSTRAINT "NoteChecklistItems_ownerId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "passHash",
DROP COLUMN "passSalt",
ADD COLUMN     "passSaltHash" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "NoteChecklistItems" ADD CONSTRAINT "NoteChecklistItems_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
