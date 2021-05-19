/* tslint:disable */
/* eslint-disable */
/**
 * v2.0 Documentation
 * Swagger Specification
 *
 * The version of the OpenAPI document: v2
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import {
    Event,
    EventFromJSON,
    EventToJSON,
} from '../models';

export interface AnalyticsEventCreateRequest {
    data: Event;
}

/**
 * 
 */
export class AnalyticsApi extends runtime.BaseAPI {

    /**
     */
    async analyticsEventCreateRaw(requestParameters: AnalyticsEventCreateRequest): Promise<runtime.ApiResponse<Event>> {
        if (requestParameters.data === null || requestParameters.data === undefined) {
            throw new runtime.RequiredError('data','Required parameter requestParameters.data was null or undefined when calling analyticsEventCreate.');
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && (this.configuration.username !== undefined || this.configuration.password !== undefined)) {
            headerParameters["Authorization"] = "Basic " + btoa(this.configuration.username + ":" + this.configuration.password);
        }
        const response = await this.request({
            path: `/analytics/event`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: EventToJSON(requestParameters.data),
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => EventFromJSON(jsonValue));
    }

    /**
     */
    async analyticsEventCreate(requestParameters: AnalyticsEventCreateRequest): Promise<Event> {
        const response = await this.analyticsEventCreateRaw(requestParameters);
        return await response.value();
    }

}
