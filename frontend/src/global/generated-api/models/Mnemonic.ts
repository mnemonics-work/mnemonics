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
/**
 * 
 * @export
 * @interface Mnemonic
 */
export interface Mnemonic {
    /**
     * 
     * @type {number}
     * @memberof Mnemonic
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof Mnemonic
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof Mnemonic
     */
    description?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Mnemonic
     */
    expression?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Mnemonic
     */
    sourceUrl?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof Mnemonic
     */
    links?: Array<string> | null;
    /**
     * 
     * @type {Set<number>}
     * @memberof Mnemonic
     */
    types: Set<number>;
}

export function MnemonicFromJSON(json: any): Mnemonic {
    return MnemonicFromJSONTyped(json, false);
}

export function MnemonicFromJSONTyped(json: any, ignoreDiscriminator: boolean): Mnemonic {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'title': json['title'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'expression': !exists(json, 'expression') ? undefined : json['expression'],
        'sourceUrl': !exists(json, 'source_url') ? undefined : json['source_url'],
        'links': !exists(json, 'links') ? undefined : json['links'],
        'types': json['types'],
    };
}

export function MnemonicToJSON(value?: Mnemonic | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'description': value.description,
        'expression': value.expression,
        'source_url': value.sourceUrl,
        'links': value.links,
        'types': value.types,
    };
}


