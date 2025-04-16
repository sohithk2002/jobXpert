-- AlterTable
ALTER TABLE "User" ADD COLUMN     "endsAt" TIMESTAMP(3),
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;
