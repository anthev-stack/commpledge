-- CreateTable
CREATE TABLE "ServerBoost" (
    "id" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServerBoost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFavorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serverId" TEXT,
    "communityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFavorite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServerBoost_serverId_idx" ON "ServerBoost"("serverId");

-- CreateIndex
CREATE INDEX "ServerBoost_userId_idx" ON "ServerBoost"("userId");

-- CreateIndex
CREATE INDEX "ServerBoost_expiresAt_idx" ON "ServerBoost"("expiresAt");

-- CreateIndex
CREATE INDEX "ServerBoost_isActive_idx" ON "ServerBoost"("isActive");

-- CreateIndex
CREATE INDEX "UserFavorite_userId_idx" ON "UserFavorite"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_serverId_key" ON "UserFavorite"("userId", "serverId");

-- CreateIndex
CREATE UNIQUE INDEX "UserFavorite_userId_communityId_key" ON "UserFavorite"("userId", "communityId");

-- AddForeignKey
ALTER TABLE "ServerBoost" ADD CONSTRAINT "ServerBoost_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServerBoost" ADD CONSTRAINT "ServerBoost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_serverId_fkey" FOREIGN KEY ("serverId") REFERENCES "Server"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserFavorite" ADD CONSTRAINT "UserFavorite_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;
