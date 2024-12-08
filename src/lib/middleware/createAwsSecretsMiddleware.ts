import { 
    SecretsManagerClient, 
    GetSecretValueCommand 
  } from "@aws-sdk/client-secrets-manager";
import type { ISecretManagerConfig } from "../interfaces/ISecretManagerConfig";
  
    
  export class AWSSecretsManagerError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'AWSSecretsManagerError';
    }
  }
  
  export const createAwsSecretsMiddleware = (config: ISecretManagerConfig) => {
    const secretsClient = new SecretsManagerClient({ 
      region: config.region 
    });
  
    let secretCache: Record<string, string> | null = null;
    let lastFetchTime: number = 0;
    const CACHE_TTL = 1000 * 60 * 60;
  
    const fetchSecrets = async (): Promise<Record<string, string>> => {
      try {
        const command = new GetSecretValueCommand({
          SecretId: config.secretName,
        });
        
        const response = await secretsClient.send(command);
        
        if (!response.SecretString) {
          throw new AWSSecretsManagerError('No secret string found');
        }
  
        return JSON.parse(response.SecretString);
      } catch (error) {
        console.error('Error fetching secrets:', error);
        throw error;
      }
    };
  
    const getSecrets = async (): Promise<Record<string, string>> => {
      const now = Date.now();
      
      if (secretCache && (now - lastFetchTime < CACHE_TTL)) {
        return secretCache;
      }
  
      const secrets = await fetchSecrets();
      secretCache = secrets;
      lastFetchTime = now;
      
      return secrets;
    };
  
    return async (headers?: Record<string, string>): Promise<Record<string, string>> => {
      const secrets = await getSecrets();
      const updatedHeaders = { ...headers };
  
      for (const [headerName, envVar] of Object.entries(config.headerMappings)) {
        if (secrets[envVar]) {
          updatedHeaders[headerName] = secrets[envVar];
        }
      }
  
      return updatedHeaders;
    };
  };