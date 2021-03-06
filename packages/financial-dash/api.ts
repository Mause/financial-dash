/* tslint:disable */
/* eslint-disable */
/**
 * Financial Dash
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from "./configuration";
import globalAxios, {
  AxiosPromise,
  AxiosInstance,
  AxiosRequestConfig,
} from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
  DUMMY_BASE_URL,
  assertParamExists,
  setApiKeyToObject,
  setBasicAuthToObject,
  setBearerAuthToObject,
  setOAuthToObject,
  setSearchParams,
  serializeDataIfNeeded,
  toPathString,
  createRequestFunction,
} from "./common";
// @ts-ignore
import {
  BASE_PATH,
  COLLECTION_FORMATS,
  RequestArgs,
  BaseAPI,
  RequiredError,
} from "./base";

/**
 *
 * @export
 * @interface DummyResponse
 */
export interface DummyResponse {
  /**
   *
   * @type {string}
   * @memberof DummyResponse
   */
  id: string;
}
/**
 *
 * @export
 * @interface InvoiceResponse
 */
export interface InvoiceResponse {
  /**
   *
   * @type {InvoiceResponseData}
   * @memberof InvoiceResponse
   */
  data: InvoiceResponseData;
}
/**
 *
 * @export
 * @interface InvoiceResponseData
 */
export interface InvoiceResponseData {
  /**
   *
   * @type {string}
   * @memberof InvoiceResponseData
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof InvoiceResponseData
   */
  clientId: string;
  /**
   *
   * @type {string}
   * @memberof InvoiceResponseData
   */
  amount: string;
}
/**
 *
 * @export
 * @interface PaymentResponse
 */
export interface PaymentResponse {
  /**
   *
   * @type {string}
   * @memberof PaymentResponse
   */
  id: string;
  /**
   *
   * @type {string}
   * @memberof PaymentResponse
   */
  client_id: string;
}
/**
 *
 * @export
 * @interface PostInvoice
 */
export interface PostInvoice {
  /**
   *
   * @type {string}
   * @memberof PostInvoice
   */
  clientId: string;
  /**
   *
   * @type {string}
   * @memberof PostInvoice
   */
  amount: string;
}
/**
 *
 * @export
 * @interface PostPayment
 */
export interface PostPayment {
  /**
   *
   * @type {string}
   * @memberof PostPayment
   */
  client_id: string;
  /**
   *
   * @type {string}
   * @memberof PostPayment
   */
  amount: string;
  /**
   *
   * @type {string}
   * @memberof PostPayment
   */
  transaction_reference: string;
  /**
   *
   * @type {string}
   * @memberof PostPayment
   */
  invoice_id: string;
}
/**
 *
 * @export
 * @interface PutInvoice
 */
export interface PutInvoice {
  /**
   *
   * @type {string}
   * @memberof PutInvoice
   */
  status: PutInvoiceStatusEnum;
}

export const PutInvoiceStatusEnum = {
  Paid: "PAID",
  _0: "0",
} as const;

export type PutInvoiceStatusEnum =
  typeof PutInvoiceStatusEnum[keyof typeof PutInvoiceStatusEnum];

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getClassTest: async (
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      const localVarPath = `/api/class_test`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Jwt required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getClassTest(
      options?: AxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<DummyResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getClassTest(
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     *
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getClassTest(options?: any): AxiosPromise<DummyResponse> {
      return localVarFp
        .getClassTest(options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
  /**
   *
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  public getClassTest(options?: AxiosRequestConfig) {
    return DefaultApiFp(this.configuration)
      .getClassTest(options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * InvoiceApi - axios parameter creator
 * @export
 */
export const InvoiceApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @param {string} invoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInvoiceInvoice: async (
      invoice: string,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'invoice' is not null or undefined
      assertParamExists("getInvoiceInvoice", "invoice", invoice);
      const localVarPath = `/api/invoice/{invoice}`.replace(
        `{${"invoice"}}`,
        encodeURIComponent(String(invoice))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "GET",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Jwt required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {PostInvoice} postInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postInvoice: async (
      postInvoice: PostInvoice,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'postInvoice' is not null or undefined
      assertParamExists("postInvoice", "postInvoice", postInvoice);
      const localVarPath = `/api/invoice`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "POST",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Jwt required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        postInvoice,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
    /**
     *
     * @param {string} invoice
     * @param {PutInvoice} putInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    putInvoiceInvoice: async (
      invoice: string,
      putInvoice: PutInvoice,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'invoice' is not null or undefined
      assertParamExists("putInvoiceInvoice", "invoice", invoice);
      // verify required parameter 'putInvoice' is not null or undefined
      assertParamExists("putInvoiceInvoice", "putInvoice", putInvoice);
      const localVarPath = `/api/invoice/{invoice}`.replace(
        `{${"invoice"}}`,
        encodeURIComponent(String(invoice))
      );
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "PUT",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Jwt required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        putInvoice,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * InvoiceApi - functional programming interface
 * @export
 */
export const InvoiceApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = InvoiceApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @param {string} invoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getInvoiceInvoice(
      invoice: string,
      options?: AxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<PutInvoice>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.getInvoiceInvoice(invoice, options);
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     *
     * @param {PostInvoice} postInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async postInvoice(
      postInvoice: PostInvoice,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<InvoiceResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.postInvoice(
        postInvoice,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
    /**
     *
     * @param {string} invoice
     * @param {PutInvoice} putInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async putInvoiceInvoice(
      invoice: string,
      putInvoice: PutInvoice,
      options?: AxiosRequestConfig
    ): Promise<
      (axios?: AxiosInstance, basePath?: string) => AxiosPromise<PutInvoice>
    > {
      const localVarAxiosArgs =
        await localVarAxiosParamCreator.putInvoiceInvoice(
          invoice,
          putInvoice,
          options
        );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * InvoiceApi - factory interface
 * @export
 */
export const InvoiceApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = InvoiceApiFp(configuration);
  return {
    /**
     *
     * @param {string} invoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInvoiceInvoice(
      invoice: string,
      options?: any
    ): AxiosPromise<PutInvoice> {
      return localVarFp
        .getInvoiceInvoice(invoice, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {PostInvoice} postInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postInvoice(
      postInvoice: PostInvoice,
      options?: any
    ): AxiosPromise<InvoiceResponse> {
      return localVarFp
        .postInvoice(postInvoice, options)
        .then((request) => request(axios, basePath));
    },
    /**
     *
     * @param {string} invoice
     * @param {PutInvoice} putInvoice
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    putInvoiceInvoice(
      invoice: string,
      putInvoice: PutInvoice,
      options?: any
    ): AxiosPromise<PutInvoice> {
      return localVarFp
        .putInvoiceInvoice(invoice, putInvoice, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * InvoiceApi - object-oriented interface
 * @export
 * @class InvoiceApi
 * @extends {BaseAPI}
 */
export class InvoiceApi extends BaseAPI {
  /**
   *
   * @param {string} invoice
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public getInvoiceInvoice(invoice: string, options?: AxiosRequestConfig) {
    return InvoiceApiFp(this.configuration)
      .getInvoiceInvoice(invoice, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {PostInvoice} postInvoice
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public postInvoice(postInvoice: PostInvoice, options?: AxiosRequestConfig) {
    return InvoiceApiFp(this.configuration)
      .postInvoice(postInvoice, options)
      .then((request) => request(this.axios, this.basePath));
  }

  /**
   *
   * @param {string} invoice
   * @param {PutInvoice} putInvoice
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof InvoiceApi
   */
  public putInvoiceInvoice(
    invoice: string,
    putInvoice: PutInvoice,
    options?: AxiosRequestConfig
  ) {
    return InvoiceApiFp(this.configuration)
      .putInvoiceInvoice(invoice, putInvoice, options)
      .then((request) => request(this.axios, this.basePath));
  }
}

/**
 * PaymentApi - axios parameter creator
 * @export
 */
export const PaymentApiAxiosParamCreator = function (
  configuration?: Configuration
) {
  return {
    /**
     *
     * @param {PostPayment} postPayment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postPayment: async (
      postPayment: PostPayment,
      options: AxiosRequestConfig = {}
    ): Promise<RequestArgs> => {
      // verify required parameter 'postPayment' is not null or undefined
      assertParamExists("postPayment", "postPayment", postPayment);
      const localVarPath = `/api/payment`;
      // use dummy base URL string because the URL constructor only accepts absolute URLs.
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }

      const localVarRequestOptions = {
        method: "POST",
        ...baseOptions,
        ...options,
      };
      const localVarHeaderParameter = {} as any;
      const localVarQueryParameter = {} as any;

      // authentication Jwt required
      // http bearer authentication required
      await setBearerAuthToObject(localVarHeaderParameter, configuration);

      localVarHeaderParameter["Content-Type"] = "application/json";

      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions =
        baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = {
        ...localVarHeaderParameter,
        ...headersFromBaseOptions,
        ...options.headers,
      };
      localVarRequestOptions.data = serializeDataIfNeeded(
        postPayment,
        localVarRequestOptions,
        configuration
      );

      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions,
      };
    },
  };
};

/**
 * PaymentApi - functional programming interface
 * @export
 */
export const PaymentApiFp = function (configuration?: Configuration) {
  const localVarAxiosParamCreator = PaymentApiAxiosParamCreator(configuration);
  return {
    /**
     *
     * @param {PostPayment} postPayment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async postPayment(
      postPayment: PostPayment,
      options?: AxiosRequestConfig
    ): Promise<
      (
        axios?: AxiosInstance,
        basePath?: string
      ) => AxiosPromise<PaymentResponse>
    > {
      const localVarAxiosArgs = await localVarAxiosParamCreator.postPayment(
        postPayment,
        options
      );
      return createRequestFunction(
        localVarAxiosArgs,
        globalAxios,
        BASE_PATH,
        configuration
      );
    },
  };
};

/**
 * PaymentApi - factory interface
 * @export
 */
export const PaymentApiFactory = function (
  configuration?: Configuration,
  basePath?: string,
  axios?: AxiosInstance
) {
  const localVarFp = PaymentApiFp(configuration);
  return {
    /**
     *
     * @param {PostPayment} postPayment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    postPayment(
      postPayment: PostPayment,
      options?: any
    ): AxiosPromise<PaymentResponse> {
      return localVarFp
        .postPayment(postPayment, options)
        .then((request) => request(axios, basePath));
    },
  };
};

/**
 * PaymentApi - object-oriented interface
 * @export
 * @class PaymentApi
 * @extends {BaseAPI}
 */
export class PaymentApi extends BaseAPI {
  /**
   *
   * @param {PostPayment} postPayment
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof PaymentApi
   */
  public postPayment(postPayment: PostPayment, options?: AxiosRequestConfig) {
    return PaymentApiFp(this.configuration)
      .postPayment(postPayment, options)
      .then((request) => request(this.axios, this.basePath));
  }
}
