import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  databaseUrl: process.env.DATABASE_URL || '',
  
  // JWT
  jwtSecret: process.env.JWT_SECRET || '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  
  // Sentry
  sentryDsn: process.env.SENTRY_DSN || '',
  sentryEnvironment: process.env.SENTRY_ENVIRONMENT || 'development',
  
  // Better Stack (Logtail)
  logtailSourceToken: process.env.LOGTAIL_SOURCE_TOKEN || '',
  
  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // OpenAI
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  
  // Cron
  cronSecret: process.env.CRON_SECRET || '',
};

// Validate required environment variables
const requiredEnvVars = ['DATABASE_URL', 'JWT_SECRET'];

if (env.nodeEnv === 'production') {
  requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  });
}
