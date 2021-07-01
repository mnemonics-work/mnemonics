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

import { exists, mapValues } from '../runtime';
import {
    Mnemonic,
    MnemonicFromJSON,
    MnemonicFromJSONTyped,
    MnemonicToJSON,
} from './';

/**
 * 
 * @export
 * @interface InlineResponse200
 */
export interface InlineResponse200 {
    /**
     * 
     * @type {number}
     * @memberof InlineResponse200
     */
    count: number;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200
     */
    next?: string | null;
    /**
     * 
     * @type {string}
     * @memberof InlineResponse200
     */
    previous?: string | null;
    /**
     * 
     * @type {Array<Mnemonic>}
     * @memberof InlineResponse200
     */
    results: Array<Mnemonic>;
}

export function InlineResponse200FromJSON(json: any): InlineResponse200 {
    return InlineResponse200FromJSONTyped(json, false);
}

export function InlineResponse200FromJSONTyped(json: any, ignoreDiscriminator: boolean): InlineResponse200 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'count': json['count'],
        'next': !exists(json, 'next') ? undefined : json['next'],
        'previous': !exists(json, 'previous') ? undefined : json['previous'],
        'results': ((json['results'] as Array<any>).map(MnemonicFromJSON)),
    };
}

export function InlineResponse200ToJSON(value?: InlineResponse200 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'count': value.count,
        'next': value.next,
        'previous': value.previous,
        'results': ((value.results as Array<any>).map(MnemonicToJSON)),
    };
}

