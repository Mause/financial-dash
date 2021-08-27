import { ResponseContext, RequestContext, HttpFile } from "../http/http";
import * as models from "../models/all";
import { Configuration } from "../configuration";

import { InlineObject } from "../models/InlineObject";
import { InlineResponseDefault } from "../models/InlineResponseDefault";
import { ObservableDefaultApi } from "./ObservableAPI";

import {
  DefaultApiRequestFactory,
  DefaultApiResponseProcessor,
} from "../apis/DefaultApi";
export class PromiseDefaultApi {
  private api: ObservableDefaultApi;

  public constructor(
    configuration: Configuration,
    requestFactory?: DefaultApiRequestFactory,
    responseProcessor?: DefaultApiResponseProcessor
  ) {
    this.api = new ObservableDefaultApi(
      configuration,
      requestFactory,
      responseProcessor
    );
  }

  /**
   * @param inlineObject
   */
  public createInvoice(
    inlineObject: InlineObject,
    _options?: Configuration
  ): Promise<void> {
    const result = this.api.createInvoice(inlineObject, _options);
    return result.toPromise();
  }
}
