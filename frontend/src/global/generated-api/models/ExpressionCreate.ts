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
    MnemonicCreateUpdate,
    MnemonicCreateUpdateFromJSON,
    MnemonicCreateUpdateFromJSONTyped,
    MnemonicCreateUpdateToJSON,
} from './';

/**
 * 
 * @export
 * @interface ExpressionCreate
 */
export interface ExpressionCreate {
    /**
     * 
     * @type {number}
     * @memberof ExpressionCreate
     */
    readonly id?: number;
    /**
     * 
     * @type {string}
     * @memberof ExpressionCreate
     */
    title: string;
    /**
     * 
     * @type {string}
     * @memberof ExpressionCreate
     */
    description?: string | null;
    /**
     * 
     * @type {Array<MnemonicCreateUpdate>}
     * @memberof ExpressionCreate
     */
    mnemonics: Array<MnemonicCreateUpdate>;
    /**
     * 
     * @type {Array<number>}
     * @memberof ExpressionCreate
     */
    categories: Array<number>;
    /**
     * 
     * @type {Array<number>}
     * @memberof ExpressionCreate
     */
    tags: Array<number>;
}

export function ExpressionCreateFromJSON(json: any): ExpressionCreate {
    return ExpressionCreateFromJSONTyped(json, false);
}

export function ExpressionCreateFromJSONTyped(json: any, ignoreDiscriminator: boolean): ExpressionCreate {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'title': json['title'],
        'description': !exists(json, 'description') ? undefined : json['description'],
        'mnemonics': ((json['mnemonics'] as Array<any>).map(MnemonicCreateUpdateFromJSON)),
        'categories': json['categories'],
        'tags': json['tags'],
    };
}

export function ExpressionCreateToJSON(value?: ExpressionCreate | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'title': value.title,
        'description': value.description,
        'mnemonics': ((value.mnemonics as Array<any>).map(MnemonicCreateUpdateToJSON)),
        'categories': value.categories,
        'tags': value.tags,
    };
}


