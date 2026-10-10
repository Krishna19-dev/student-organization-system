const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default('change-me'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation error:', parsed.error.format());
}
module.exports = { env: parsed.success ? parsed.data : process.env };
