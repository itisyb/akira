-- CreateEnum
CREATE TYPE "Language" AS ENUM ('en', 'nl');

-- CreateTable
CREATE TABLE "guilds" (
    "id" VARCHAR(32) NOT NULL,
    "prefix" VARCHAR(8) NOT NULL DEFAULT E'!a',
    "language" "Language" NOT NULL DEFAULT E'en',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);
