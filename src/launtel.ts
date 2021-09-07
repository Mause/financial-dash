/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/up": {
    get: operations["getUpTransactions"];
  };
  "/api/transactions": {};
  "/api/usage": {};
}

export interface components {
  schemas: {
    UpResponse: {
      id: string;
      attributes: {
        description: string;
        message: string;
        createdAt: string;
        amount: components["schemas"]["Amount"];
      };
    }[];
    Amount: {
      value: string;
    };
    DummyResponse: {
      id: string;
    };
  };
}

export interface operations {
  getUpTransactions: {
    responses: {
      /** Ok */
      default: {
        content: {
          "application/json": components["schemas"]["UpResponse"];
        };
      };
    };
  };
}

export interface external {}
