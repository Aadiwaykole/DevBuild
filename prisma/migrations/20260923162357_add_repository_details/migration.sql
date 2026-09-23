-- AlterTable
ALTER TABLE "Repository" ADD COLUMN     "defaultBranch" TEXT,
ADD COLUMN     "githubCreatedAt" TIMESTAMP(3),
ADD COLUMN     "githubUpdatedAt" TIMESTAMP(3),
ADD COLUMN     "htmlUrl" TEXT,
ADD COLUMN     "openIssues" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "size" INTEGER NOT NULL DEFAULT 0;
