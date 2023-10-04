/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from '@azure/msal-browser';

/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1_EvoltechBACI',
    forgotPassword: 'B2C_1_ResetPassword',
    editProfile: 'B2C_1_edit_profile_v2',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://EvoltechBACIB2C.b2clogin.com/EvoltechBACIB2C.onmicrosoft.com/B2C_1_EvoltechBACI',
    },
    forgotPassword: {
      authority:
        'https://EvoltechBACIB2C.b2clogin.com/EvoltechBACIB2C.onmicrosoft.com/B2C_1_ResetPassword',
    },
    editProfile: {
      authority:
        'https://EvoltechBACIB2C.b2clogin.com/EvoltechBACIB2C.onmicrosoft.com/B2C_1_edit_profile_v2',
    },
  },
  authorityDomain: 'EvoltechBACIB2C.b2clogin.com',
};

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const msalConfig = {
  //---------------------------------------- Local----------------------------------------
  // auth: {
  //   clientId: '3ac39f82-6a9c-49af-934e-2db2f437d8bc', // This is the ONLY mandatory field that you need to supply.
  //   authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
  //   knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
  //   redirectUri: 'http://localhost:3000', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
  //   postLogoutRedirectUri: 'http://localhost:3000', // Indicates the page to navigate after logout.
  //   navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  // },

  //---------------------------------------- Dev----------------------------------------
  // auth: {
  //   clientId: '3d3e6b6a-f8fc-41a9-9d08-d7b5c015d1ad', // This is the ONLY mandatory field that you need to supply.
  //   authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
  //   knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
  //   redirectUri: 'https://appdev.baci.app/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
  //   postLogoutRedirectUri: 'https://appdev.baci.app/', // Indicates the page to navigate after logout.
  //   navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  // },

  // ----------------------------------------Test----------------------------------------
  
  auth: {
    clientId: '89db314e-f8a5-43e2-a490-4377a23ee049', // This is the ONLY mandatory field that you need to supply.
    authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose SUSI as your default authority.
    knownAuthorities: [b2cPolicies.authorityDomain], // Mark your B2C tenant's domain as trusted.
    redirectUri: 'https://apptest.baci.app/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.origin
    postLogoutRedirectUri: 'https://apptest.baci.app/', // Indicates the page to navigate after logout.
    navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
  },
  cache: {
    cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "sessionStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

/**
 * Add here the endpoints and scopes when obtaining an access token for protected web APIs. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const protectedResources = {
  apiHello: {
    endpoint: 'http://localhost:5010/hello',
    scopes: [
      'https://bacib2c.onmicrosoft.com/6b571d9b-2c9b-4758-8e32-7a064ac462d2/tasks.read',
    ], // e.g. api://xxxxxx/access_as_user
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: [...protectedResources.apiHello.scopes],
};
