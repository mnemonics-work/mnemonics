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
 * @interface RelatedMnemonicsExpression
 */
export interface RelatedMnemonicsExpression {
    /**
     * 
     * @type {Array<MnemonicCreateUpdate>}
     * @memberof RelatedMnemonicsExpression
     */
    mnemonics: Array<MnemonicCreateUpdate>;
}

export function RelatedMnemonicsExpressionFromJSON(json: any): RelatedMnemonicsExpression {
    return RelatedMnemonicsExpressionFromJSONTyped(json, false);
}

export function RelatedMnemonicsExpressionFromJSONTyped(json: any, ignoreDiscriminator: boolean): RelatedMnemonicsExpression {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'mnemonics': ((json['mnemonics'] as Array<any>).map(MnemonicCreateUpdateFromJSON)),
    };
}

export function RelatedMnemonicsExpressionToJSON(value?: RelatedMnemonicsExpression | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'mnemonics': ((value.mnemonics as Array<any>).map(MnemonicCreateUpdateToJSON)),
    };
}


