/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/transactions": {
    get: operations["getTransactions"];
  };
  "/api/up": {
    get: operations["getUp"];
  };
  "/api/usage": {
    get: operations["getUsage"];
  };
}

export interface components {
  schemas: {
    LauntelTransactionResponse: {
      perMonth: string;
    };
    UpAttributes: {
      description: string;
      message: string;
      createdAt: string | string;
      amount: { [key: string]: unknown };
    };
    UpTransaction: {
      id: string;
      attributes: { [key: string]: unknown };
    };
    UpTransactionResponse: {
      items: { [key: string]: unknown }[];
    };
    UsageResponse: {
      usage: { [key: string]: unknown };
    };
  };
}

export interface operations {
  getTransactions: {
    responses: {
      /** Ok */
      default: {
        content: {
          "application/json": components["schemas"]["LauntelTransactionResponse"];
        };
      };
    };
  };
  getUp: {
    responses: {
      /** Ok */
      default: {
        content: {
          "application/json": components["schemas"]["UpTransactionResponse"];
        };
      };
    };
  };
  getUsage: {
    responses: {
      /** Ok */
      default: {
        content: {
          "application/json": components["schemas"]["UsageResponse"];
        };
      };
    };
  };
}

export interface external {}
