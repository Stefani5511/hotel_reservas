const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb(process.env.DATABASE_URL);

module.exports = prisma;
