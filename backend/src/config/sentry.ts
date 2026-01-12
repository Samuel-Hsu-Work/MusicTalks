import * as Sentry from '@sentry/node';
import { env } from './env';

export const initSentry = () => {
  if (env.sentryDsn) {
    Sentry.init({
      dsn: env.sentryDsn,
      environment: env.sentryEnvironment,
      tracesSampleRate: 1.0,
    });
  }
};

export { Sentry };
