-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payment_method" "PaymentMethod" NOT NULL DEFAULT 'COD',
ADD COLUMN     "phone" TEXT;
