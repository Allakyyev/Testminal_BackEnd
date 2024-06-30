import { Constants } from '@devexpress/utils/lib/constants';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
export class ApiParameterDescriptor {
    constructor(parameterName, parameterType, typeAssertion, getResult) {
        this.parameterName = parameterName;
        this.parameterType = parameterType;
        this.typeAssertion = typeAssertion;
        this.getResult = getResult;
    }
    getStringRepresentation(canBeUndefined) {
        return `${this.parameterName}: ${this.parameterType}${canBeUndefined ? '|undefined' : ''}`;
    }
}
export class ApiParametersChecker {
    static check(value, parameterIndex, canBeUndefined, pairs) {
        for (const pair of pairs) {
            if (pair.typeAssertion(value))
                return pair.getResult(value);
        }
        if (canBeUndefined && value === undefined)
            return undefined;
        ApiParametersChecker.showErrorString(parameterIndex, canBeUndefined, pairs);
    }
    static showErrorString(parameterIndex, canBeUndefined, pairs) {
        const pairStringRepresentation = ListUtils.map(pairs, (pair) => pair.getStringRepresentation(canBeUndefined));
        let parameterIndexAsString;
        switch (parameterIndex) {
            case 1:
                parameterIndexAsString = 'First';
                break;
            case 2:
                parameterIndexAsString = 'Second';
                break;
            case 3:
                parameterIndexAsString = 'Third';
                break;
            case 4:
                parameterIndexAsString = 'Fourth';
                break;
            case 5:
                parameterIndexAsString = 'Fifth';
                break;
            case 6:
                parameterIndexAsString = 'Sixth';
                break;
            case 7:
                parameterIndexAsString = 'Seventh';
                break;
            case 8:
                parameterIndexAsString = 'Eighth';
                break;
            case 9:
                parameterIndexAsString = 'Ninth';
                break;
            case 10:
                parameterIndexAsString = 'Tenth';
                break;
            default:
                parameterIndexAsString = 'One of the last';
                break;
        }
        throw new Error(`${parameterIndexAsString} parameter must be one of [${pairStringRepresentation.join(', ')}]`);
    }
    static defaultDescriptor(getResult) {
        return new ApiParameterDescriptor('', '', () => true, getResult);
    }
    static numberDescriptor(parameterName, getResult, minBound = Constants.MIN_SAFE_INTEGER, maxBound = Constants.MAX_SAFE_INTEGER) {
        return new ApiParameterDescriptor(parameterName, `number on interval [${minBound}, ${maxBound}]`, (value) => isNumber(value) && (value >= minBound && value < maxBound), getResult);
    }
    static booleanDescriptor(parameterName, getResult) {
        return new ApiParameterDescriptor(parameterName, 'boolean', (value) => typeof value === 'boolean', getResult);
    }
    static arrayDescriptor(parameterName, getResult) {
        return new ApiParameterDescriptor(parameterName, 'array', (value) => value instanceof Array, getResult);
    }
    static functionDescriptor(parameterName, getResult) {
        return new ApiParameterDescriptor(parameterName, 'function', (value) => typeof value === 'function', getResult);
    }
    static stringDescriptor(parameterName, getResult, canBeEmpty) {
        return new ApiParameterDescriptor(parameterName, 'string', (value) => (typeof value === 'string') && (canBeEmpty || !!value.length), getResult);
    }
    static stringDescriptorPredefined(parameterName, map, canBeEmpty) {
        return new ApiParameterDescriptor(parameterName, `string of constants(${StringMapUtils.toList(StringMapUtils.map(map, (_e, key) => `"${key}"`)).join(', ')})`, (value) => (typeof value === 'string') && (canBeEmpty || !!value.length) && map[value] !== undefined, (val) => map[val]);
    }
    static regExpDescriptor(parameterName, getResult) {
        return new ApiParameterDescriptor(parameterName, 'RegExp', (value) => (typeof value === 'object'), getResult);
    }
    static enumDescriptor(parameterName, getResult, enumTypeObj, enumTypeName) {
        return new ApiParameterDescriptor(parameterName, enumTypeName, (value) => enumTypeObj[value] !== undefined, getResult);
    }
    static objectDescriptor(parameterName, objectTypeAsString, getResult) {
        return new ApiParameterDescriptor(parameterName, objectTypeAsString, (value) => typeof value === 'object', getResult);
    }
}
