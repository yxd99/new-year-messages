import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  TZ: z.string().default('America/Bogota'),
  API_TOKEN: z.string().min(1, 'API_TOKEN es requerido'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USERNAME: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_DATABASE: z.string().default('new_year_messages'),
  TIKTOK_API_URL: z.string().url().optional(),
  TIKTOK_ACCESS_TOKEN: z.string().optional(),
  DEFAULT_CRON_EXPRESSION: z.string().default('*/5 * * * *'),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(): EnvConfig {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Variables de entorno inválidas:');
    console.error(result.error.format());
    throw new Error('Variables de entorno inválidas');
  }

  console.log('✅ Variables de entorno validadas correctamente');
  console.log(`🌎 Zona horaria: ${result.data.TZ}`);
  console.log(`🔐 API Token configurado`);
  return result.data;
}

export const env = validateEnv();
