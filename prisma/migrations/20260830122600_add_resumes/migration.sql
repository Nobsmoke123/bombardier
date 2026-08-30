-- CreateEnum
CREATE TYPE "ResumeFocus" AS ENUM ('BACKEND', 'FULLSTACK', 'FRONTEND', 'DEVOPS');

-- CreateTable
CREATE TABLE "Resume" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "focus" "ResumeFocus" NOT NULL,
    "fileKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Resume_fileKey_key" ON "Resume"("fileKey");

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
