-- AlterTable
ALTER TABLE "Server" ADD COLUMN "region" TEXT,
ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Server_gameType_idx" ON "Server"("gameType");

-- CreateIndex
CREATE INDEX "Server_region_idx" ON "Server"("region");

