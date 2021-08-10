/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/": {
    get: {
      responses: {
        /** OK */
        200: unknown;
      };
    };
  };
  "/Bill": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Bill.id"];
          billDate?: parameters["rowFilter.Bill.billDate"];
          vendor?: parameters["rowFilter.Bill.vendor"];
          amount?: parameters["rowFilter.Bill.amount"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Bill"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** Bill */
          Bill?: definitions["Bill"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Bill.id"];
          billDate?: parameters["rowFilter.Bill.billDate"];
          vendor?: parameters["rowFilter.Bill.vendor"];
          amount?: parameters["rowFilter.Bill.amount"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Bill.id"];
          billDate?: parameters["rowFilter.Bill.billDate"];
          vendor?: parameters["rowFilter.Bill.vendor"];
          amount?: parameters["rowFilter.Bill.amount"];
        };
        body: {
          /** Bill */
          Bill?: definitions["Bill"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/Payer": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payer.id"];
          name?: parameters["rowFilter.Payer.name"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Payer"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** Payer */
          Payer?: definitions["Payer"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payer.id"];
          name?: parameters["rowFilter.Payer.name"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payer.id"];
          name?: parameters["rowFilter.Payer.name"];
        };
        body: {
          /** Payer */
          Payer?: definitions["Payer"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/Payment": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payment.id"];
          paidFor?: parameters["rowFilter.Payment.paidFor"];
          paidBy?: parameters["rowFilter.Payment.paidBy"];
          amount?: parameters["rowFilter.Payment.amount"];
          bankId?: parameters["rowFilter.Payment.bankId"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Payment"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** Payment */
          Payment?: definitions["Payment"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payment.id"];
          paidFor?: parameters["rowFilter.Payment.paidFor"];
          paidBy?: parameters["rowFilter.Payment.paidBy"];
          amount?: parameters["rowFilter.Payment.amount"];
          bankId?: parameters["rowFilter.Payment.bankId"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Payment.id"];
          paidFor?: parameters["rowFilter.Payment.paidFor"];
          paidBy?: parameters["rowFilter.Payment.paidBy"];
          amount?: parameters["rowFilter.Payment.amount"];
          bankId?: parameters["rowFilter.Payment.bankId"];
        };
        body: {
          /** Payment */
          Payment?: definitions["Payment"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
  "/Vendor": {
    get: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Vendor.id"];
          name?: parameters["rowFilter.Vendor.name"];
          /** Filtering Columns */
          select?: parameters["select"];
          /** Ordering */
          order?: parameters["order"];
          /** Limiting and Pagination */
          offset?: parameters["offset"];
          /** Limiting and Pagination */
          limit?: parameters["limit"];
        };
        header: {
          /** Limiting and Pagination */
          Range?: parameters["range"];
          /** Limiting and Pagination */
          "Range-Unit"?: parameters["rangeUnit"];
          /** Preference */
          Prefer?: parameters["preferCount"];
        };
      };
      responses: {
        /** OK */
        200: {
          schema: definitions["Vendor"][];
        };
        /** Partial Content */
        206: unknown;
      };
    };
    post: {
      parameters: {
        body: {
          /** Vendor */
          Vendor?: definitions["Vendor"];
        };
        query: {
          /** Filtering Columns */
          select?: parameters["select"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** Created */
        201: unknown;
      };
    };
    delete: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Vendor.id"];
          name?: parameters["rowFilter.Vendor.name"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
    patch: {
      parameters: {
        query: {
          id?: parameters["rowFilter.Vendor.id"];
          name?: parameters["rowFilter.Vendor.name"];
        };
        body: {
          /** Vendor */
          Vendor?: definitions["Vendor"];
        };
        header: {
          /** Preference */
          Prefer?: parameters["preferReturn"];
        };
      };
      responses: {
        /** No Content */
        204: never;
      };
    };
  };
}

export interface definitions {
  Bill: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    billDate: string;
    /**
     * Note:
     * This is a Foreign Key to `Vendor.id`.<fk table='Vendor' column='id'/>
     */
    vendor: number;
    amount: number;
  };
  Payer: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    name: string;
  };
  Payment: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    /**
     * Note:
     * This is a Foreign Key to `Bill.id`.<fk table='Bill' column='id'/>
     */
    paidFor?: number;
    /**
     * Note:
     * This is a Foreign Key to `Payer.id`.<fk table='Payer' column='id'/>
     */
    paidBy?: number;
    amount: number;
    bankId?: string;
  };
  Vendor: {
    /**
     * Note:
     * This is a Primary Key.<pk/>
     */
    id: number;
    name: string;
  };
}

export interface parameters {
  /** Preference */
  preferParams: "params=single-object";
  /** Preference */
  preferReturn: "return=representation" | "return=minimal" | "return=none";
  /** Preference */
  preferCount: "count=none";
  /** Filtering Columns */
  select: string;
  /** On Conflict */
  on_conflict: string;
  /** Ordering */
  order: string;
  /** Limiting and Pagination */
  range: string;
  /** Limiting and Pagination */
  rangeUnit: string;
  /** Limiting and Pagination */
  offset: string;
  /** Limiting and Pagination */
  limit: string;
  /** Bill */
  "body.Bill": definitions["Bill"];
  "rowFilter.Bill.id": string;
  "rowFilter.Bill.billDate": string;
  "rowFilter.Bill.vendor": string;
  "rowFilter.Bill.amount": string;
  /** Payer */
  "body.Payer": definitions["Payer"];
  "rowFilter.Payer.id": string;
  "rowFilter.Payer.name": string;
  /** Payment */
  "body.Payment": definitions["Payment"];
  "rowFilter.Payment.id": string;
  "rowFilter.Payment.paidFor": string;
  "rowFilter.Payment.paidBy": string;
  "rowFilter.Payment.amount": string;
  "rowFilter.Payment.bankId": string;
  /** Vendor */
  "body.Vendor": definitions["Vendor"];
  "rowFilter.Vendor.id": string;
  "rowFilter.Vendor.name": string;
}

export interface operations {}

export interface external {}
