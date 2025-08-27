import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SMTP_URL: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("uploads"),
});

export const env = envSchema.parse(process.env);

