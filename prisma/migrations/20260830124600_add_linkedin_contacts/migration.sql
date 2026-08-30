-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'CONVERSING');

-- CreateTable
CREATE TABLE "LinkedInContact" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'PENDING',
    "conversationNotes" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "LinkedInContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LinkedInContact_applicationId_idx" ON "LinkedInContact"("applicationId");

-- AddForeignKey
ALTER TABLE "LinkedInContact" ADD CONSTRAINT "LinkedInContact_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
