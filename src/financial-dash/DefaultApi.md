# .DefaultApi

All URIs are relative to *https://financial-dash.vercel.app*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createInvoice**](DefaultApi.md#createInvoice) | **POST** /api/invoice | 


# **createInvoice**
> createInvoice(inlineObject)


### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .DefaultApi(configuration);

let body:.DefaultApiCreateInvoiceRequest = {
  // InlineObject
  inlineObject: {
    clientId: "clientId_example",
    amount: 3.14,
  },
};

apiInstance.createInvoice(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **inlineObject** | **InlineObject**|  |


### Return type

void (empty response body)

### Authorization

[Jwt](README.md#Jwt)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**0** | OK |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


