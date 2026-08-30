-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('NOT_APPLIED', 'APPLIED', 'HR_STAGE', 'TECHNICAL', 'FINAL_INTERVIEW', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Application" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "resumeId" UUID,
    "role" TEXT NOT NULL DEFAULT '',
    "coverLetter" TEXT,
    "linkedinMessage" TEXT,
    "applied" BOOLEAN NOT NULL DEFAULT false,
    "linkedinOutreach" BOOLEAN NOT NULL DEFAULT false,
    "connectionCount" INTEGER NOT NULL DEFAULT 0,
    "applicationDate" TIMESTAMP(3),
    "status" "ApplicationStatus" NOT NULL DEFAULT 'NOT_APPLIED',

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Application_companyId_key" ON "Application"("companyId");

-- CreateIndex
CREATE INDEX "Application_status_idx" ON "Application"("status");

-- CreateIndex
CREATE INDEX "Application_resumeId_idx" ON "Application"("resumeId");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "Resume"("id") ON DELETE SET NULL ON UPDATE CASCADE;
