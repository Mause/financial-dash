import { ResponseContext, RequestContext, HttpFile } from '../http/http';
import * as models from '../models/all';
import { Configuration} from '../configuration'

import { InlineObject } from '../models/InlineObject';
import { InlineResponseDefault } from '../models/InlineResponseDefault';

import { ObservableDefaultApi } from "./ObservableAPI";
import { DefaultApiRequestFactory, DefaultApiResponseProcessor} from "../apis/DefaultApi";

export interface DefaultApiCreateInvoiceRequest {
    /**
     * 
     * @type InlineObject
     * @memberof DefaultApicreateInvoice
     */
    inlineObject: InlineObject
}

export class ObjectDefaultApi {
    private api: ObservableDefaultApi

    public constructor(configuration: Configuration, requestFactory?: DefaultApiRequestFactory, responseProcessor?: DefaultApiResponseProcessor) {
        this.api = new ObservableDefaultApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * @param param the request object
     */
    public createInvoice(param: DefaultApiCreateInvoiceRequest, options?: Configuration): Promise<void> {
        return this.api.createInvoice(param.inlineObject,  options).toPromise();
    }

}
