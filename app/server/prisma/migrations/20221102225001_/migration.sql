-- CreateTable
CREATE TABLE "Follow" (
    "id" SERIAL NOT NULL,
    "target" TEXT NOT NULL,
    "followId" INTEGER NOT NULL,
    "UserId" INTEGER,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
