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
 * @interface IsAuthorExpression
 */
export interface IsAuthorExpression {
    /**
     * 
     * @type {number}
     * @memberof IsAuthorExpression
     */
    readonly id?: number;
    /**
     * 
     * @type {boolean}
     * @memberof IsAuthorExpression
     */
    readonly isAuthor?: boolean;
}

export function IsAuthorExpressionFromJSON(json: any): IsAuthorExpression {
    return IsAuthorExpressionFromJSONTyped(json, false);
}

export function IsAuthorExpressionFromJSONTyped(json: any, ignoreDiscriminator: boolean): IsAuthorExpression {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': !exists(json, 'id') ? undefined : json['id'],
        'isAuthor': !exists(json, 'is_author') ? undefined : json['is_author'],
    };
}

export function IsAuthorExpressionToJSON(value?: IsAuthorExpression | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
    };
}

