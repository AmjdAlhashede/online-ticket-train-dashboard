import { PrismaClient } from "@prisma/client"

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

// Ensure DATABASE_URL is set during build to avoid Prisma validation errors
if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/postgres";
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma
