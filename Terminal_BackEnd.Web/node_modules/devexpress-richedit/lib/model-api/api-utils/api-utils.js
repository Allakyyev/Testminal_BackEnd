import { ColorHelper } from '../../core/model/color/color';
import { ModelIterator } from '../../core/model/model-iterator';
import { Constants } from '@devexpress/utils/lib/constants';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
export class ApiUtils {
    static getObject(objs, getStartPos, toFind, templateObj) {
        const startIndex = SearchUtils.normedInterpolationIndexOf(objs, getStartPos, toFind);
        for (let i = startIndex, obj; (obj = objs[i]) && (getStartPos(obj) == toFind); i--)
            if (obj.equals(templateObj))
                return i;
        for (let i = startIndex + 1, obj; (obj = objs[i]) && (getStartPos(obj) == toFind); i++)
            if (obj.equals(templateObj))
                return i;
        return -1;
    }
    static getAllRunsByFullSearch(sd, callback) {
        const it = new ModelIterator(sd, false);
        it.setPosition(0);
        do {
            if (callback(it))
                return it;
        } while (it.moveToNextRun());
        return null;
    }
    static internalColorToApiColor(color) {
        if (color === undefined)
            return undefined;
        if (color === ColorHelper.AUTOMATIC_COLOR)
            return 'Auto';
        if (color === ColorHelper.NO_COLOR)
            return 'NoColor';
        return ColorUtils.colorToHash(color).toUpperCase();
    }
    static assertObject(value, parameter) {
        if (typeof value !== 'object')
            throw new Error(parameter + ' must be object');
    }
    static assertBoolean(value, parameter) {
        if (typeof value !== 'boolean')
            throw new Error(parameter + ' must be boolean or undefined');
    }
    static assertArray(value, parameter) {
        if (!(value instanceof Array))
            throw new Error(parameter + ' must be array or undefined');
    }
    static assertNumber(value, parameter) {
        if (!isNumber(value))
            throw new Error(parameter + ' must be number or undefined');
    }
    static assertNonNegativeNumber(value, parameter) {
        ApiUtils.assertNumber(value, parameter);
        if (value < 0)
            throw new Error(parameter + ' must be non-negative');
    }
    static assertNumberByBounds(value, minValue, maxValue, parameter) {
        ApiUtils.assertNumber(value, parameter);
        if (value < minValue || value > maxValue)
            throw new Error(`${parameter} must be between ${minValue} and ${maxValue}`);
    }
    static assertPositiveNumber(value, parameter) {
        ApiUtils.assertNumber(value, parameter);
        if (value <= 0)
            throw new Error(parameter + ' must be positive');
    }
    static assertFunction(value, parameter) {
        if (typeof value !== 'function')
            throw new Error(parameter + ' must be function');
    }
    static assertString(value, notEmpty, parameter) {
        if (typeof value !== 'string')
            throw new Error(parameter + ' must be string or undefined');
        if (notEmpty && !value)
            throw new Error(parameter + ' must be non-empty or undefined');
    }
    static assertAndConvertColor(value, allowNull, parameter) {
        const typeMessage = `${parameter} must be string${allowNull ? ' or null' : ''}`;
        if (value === undefined)
            throw new Error(typeMessage);
        if (value === null || value === '') {
            if (allowNull)
                return null;
            throw new Error(typeMessage);
        }
        if (typeof value !== 'string')
            throw new Error(typeMessage);
        if (ColorUtils.colorNames[value])
            value = ColorUtils.colorNames[value];
        else if (value.length !== 4 && value.length !== 7 && value.charAt(0) != '#')
            throw new Error(parameter + ' must be hash code or a known color');
        if (value.toLocaleLowerCase() === 'auto')
            return null;
        const color = ColorUtils.fromString(value);
        if (color === null)
            throw new Error(`${parameter} is unknown color (${value})`);
        return color;
    }
    static assertFile(value, parameter) {
        if (typeof value === 'string') {
            if (value.length > 0)
                return;
        }
        throw new Error(parameter + ' must be non-empty string or File');
    }
    static assertEnum(value, enumType, enumTypeName, parameter) {
        if (enumType[value] === undefined)
            throw new Error(parameter + ' must be ' + enumTypeName);
    }
    static isNullOrEmptyString(value) {
        return value === null || value === '';
    }
}
export function getRestrictedInterval(interval, minBound = Constants.MIN_SAFE_INTEGER, maxBound = Constants.MAX_SAFE_INTEGER) {
    const end = MathUtils.restrictValue(interval.start + interval.length, minBound, maxBound);
    const start = MathUtils.restrictValue(interval.start, minBound, maxBound);
    return FixedInterval.fromPositions(start, Math.max(start, end));
}
