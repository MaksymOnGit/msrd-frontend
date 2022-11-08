import { AuthConfig } from 'angular-oauth2-oidc';

export const passwordFlowConfig: AuthConfig = {
  issuer: 'http://localhost:5292/',
  scope: 'offline_access',
  responseType: 'token',
  showDebugInformation: true,
  oidc: false,
};
