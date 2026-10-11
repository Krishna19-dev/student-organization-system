const { z } = require('zod');
require('dotenv').config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  DATABASE_URL: z.string().optional(),
  JWT_SECRET: z.string().default('clubhub-super-secret-jwt-key-2026'),
  PAYMENT_MODE: z.string().default('razorpay'),
  RAZORPAY_KEY_ID: z.string().default('rzp_test_TmPB80JLFGV93g'),
  RAZORPAY_KEY_SECRET: z.string().default('WHLrER4GjPfsApLDJuDP8soH'),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error('Environment validation error:', parsed.error.format());
}
module.exports = { env: parsed.success ? parsed.data : process.env };

