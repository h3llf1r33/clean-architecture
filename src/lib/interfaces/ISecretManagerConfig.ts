import type { EnvironmentVariable, HeaderName } from "./Aliases";

export interface ISecretManagerConfig {
    secretName: string;
    region: string;
    headerMappings: Record<HeaderName, EnvironmentVariable>;
  }