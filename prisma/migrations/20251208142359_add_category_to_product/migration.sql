-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT DEFAULT 'Uncategorized',
ADD COLUMN     "colors" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "images" TEXT[] DEFAULT ARRAY[]::TEXT[];
