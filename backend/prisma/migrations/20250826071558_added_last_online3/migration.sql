/*
  Warnings:

  - Made the column `lastActive` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "lastActive" SET NOT NULL,
ALTER COLUMN "lastActive" SET DEFAULT CURRENT_TIMESTAMP;
