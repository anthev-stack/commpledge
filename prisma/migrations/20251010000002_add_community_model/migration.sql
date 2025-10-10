-- CreateTable
CREATE TABLE "Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "about" TEXT,
    "imageUrl" TEXT,
    "bannerUrl" TEXT,
    "discordUrl" TEXT,
    "websiteUrl" TEXT,
    "twitterUrl" TEXT,
    "youtubeUrl" TEXT,
    "gameTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "region" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "memberCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "ownerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Server" ADD COLUMN "communityId" TEXT;

-- CreateIndex
CREATE INDEX "Community_ownerId_idx" ON "Community"("ownerId");

-- CreateIndex
CREATE INDEX "Community_isActive_idx" ON "Community"("isActive");

-- CreateIndex
CREATE INDEX "Server_communityId_idx" ON "Server"("communityId");

-- AddForeignKey
ALTER TABLE "Server" ADD CONSTRAINT "Server_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Community" ADD CONSTRAINT "Community_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

