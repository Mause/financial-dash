/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/api/invoice": {
    post: operations["createInvoice"];
  };
}

export interface components {}

export interface operations {
  createInvoice: {
    responses: {
      /** OK */
      default: {
        content: {
          "application/json": {
            id?: string;
          };
        };
      };
    };
    requestBody: {
      content: {
        "application/json": {
          clientId: string;
          amount: number;
        };
      };
    };
  };
}

export interface external {}
