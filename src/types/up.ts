/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/api/up": {
    get: operations["getUp"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    UpAttributes: {
      description: string;
      message: string;
      createdAt: string;
      amount: components["schemas"]["Amount"];
    };
    UpTransaction: {
      id: string;
      attributes: components["schemas"]["UpAttributes"];
    };
    UpLinks: {
      /** Format: url */
      next?: string;
    };
    UpTransactionResponse: {
      items: components["schemas"]["UpTransaction"][];
      links: components["schemas"]["UpLinks"];
    };
    Amount: {
      valueInBaseUnits: number;
      value: string;
    };
  };
  responses: {
  };
  parameters: {
  };
  requestBodies: {
  };
  headers: {
  };
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  getUp: {
    responses: {
      /** @description Ok */
      default: {
        content: {
          "application/json": components["schemas"]["UpTransactionResponse"];
        };
      };
    };
  };
}
