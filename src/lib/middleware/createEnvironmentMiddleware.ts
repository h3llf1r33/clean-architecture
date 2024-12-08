import type { EnvironmentVariable, HeaderName } from "../interfaces/Aliases";

export class EnvironmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EnvironmentError';
  }
}

/**
Usage:
  const middleware = createEnvironmentMiddleware({
    headerMappings: {
      'X-API-Key': 'API_KEY',
      'X-Client-Secret': 'CLIENT_SECRET'
    }
  });
*/
export const createEnvironmentMiddleware = (mapping: {
    headerMappings: Record<HeaderName, EnvironmentVariable>
  }) => {
  let secretCache: Record<string, string> | null = null;
  let lastFetchTime: number = 0;
  const CACHE_TTL = 1000 * 60 * 5;

  const getSecrets = (): Record<string, string> => {
    const now = Date.now();
    
    if (secretCache && (now - lastFetchTime < CACHE_TTL)) {
      return secretCache;
    }

    const secrets: Record<string, string> = {};
    
    const envVars = Array.from(new Set(Object.values(mapping.headerMappings)));
    
    for (const envVar of envVars) {
      const value = process.env[envVar];
      if (!value) {
        throw new EnvironmentError(`Environment variable ${envVar} not found`);
      }
      secrets[envVar] = value;
    }

    secretCache = secrets;
    lastFetchTime = now;
    
    return secrets;
  };

  return (headers?: Record<string, string>): Record<string, string> => {
    try {
      const secrets = getSecrets();
      const updatedHeaders = { ...headers };

      for (const [headerName, envVar] of Object.entries(mapping.headerMappings)) {
        if (secrets[envVar]) {
          updatedHeaders[headerName] = secrets[envVar];
        }
      }

      return updatedHeaders;
    } catch (error) {
      if (error instanceof EnvironmentError) {
        throw error;
      }
      throw new EnvironmentError('Failed to process secrets for headers');
    }
  };
};