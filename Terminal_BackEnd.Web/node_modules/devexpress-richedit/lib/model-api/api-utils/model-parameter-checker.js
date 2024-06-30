import { ApiParameterDescriptor, ApiParametersChecker } from '../../api-utils/api-utils/parameter-checker';
import { ColorHelper } from '../../core/model/color/color';
import { Constants } from '@devexpress/utils/lib/constants';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export class ModelParametersChecker {
    static isInterval(value) {
        return typeof value === 'object' && typeof value.start === 'number' && typeof value.length === 'number';
    }
    static intervalDescriptor(parameterName, getResult, minBound = Constants.MIN_SAFE_INTEGER, maxBound = Constants.MAX_SAFE_INTEGER) {
        return new ApiParameterDescriptor(parameterName, `ASPx.Interval on interval [${minBound}, ${maxBound})`, (value) => ModelParametersChecker.isInterval(value) && value.start >= minBound && value.start + value.length <= maxBound, getResult);
    }
    static intervalsDescriptor(parameterName, getResult, minBound = Constants.MIN_SAFE_INTEGER, maxBound = Constants.MAX_SAFE_INTEGER) {
        return new ApiParameterDescriptor(parameterName, `ASPx.Interval[] on interval [${minBound}, ${maxBound})`, (intervals) => Array.isArray(intervals) && ListUtils.allOf(intervals, (interval) => ModelParametersChecker.isInterval(interval) && interval.start >= minBound && interval.start + interval.length <= maxBound), getResult);
    }
    static colorDescriptors(parameterName) {
        return [
            new ApiParameterDescriptor(parameterName, `"Auto"`, (value) => typeof value === 'string' && value.toLowerCase() == 'auto', (_value) => ColorHelper.AUTOMATIC_COLOR),
            new ApiParameterDescriptor(parameterName, `"NoColor"`, (value) => typeof value === 'string' && value.toLowerCase() == 'nocolor', (_value) => ColorHelper.NO_COLOR),
            new ApiParameterDescriptor(parameterName, 'KnownColorName(darkblue, darkcyan, etc)', (value) => typeof value === 'string' && ColorUtils.isKnownColorName(value), (value) => ColorUtils.fromString(ColorUtils.colorNames[value.toLowerCase()])),
            new ApiParameterDescriptor(parameterName, '#354843|rgb(255,0,0)', (value) => {
                if (typeof value !== 'string')
                    return false;
                const val = ColorUtils.fromString(value.toLowerCase());
                return val !== null && val != undefined;
            }, (value) => ColorUtils.fromString(value.toLowerCase()))
        ];
    }
    static subDocumentById(subDocumentId, parameterIndex, canBeUndefined, model, defaultSubDocument, isShowErrorIfIdNotFound) {
        const pairs = [ApiParametersChecker.numberDescriptor('subDocumentId', (id) => model.subDocuments[id])];
        const subDocument = ApiParametersChecker.check(subDocumentId, parameterIndex, canBeUndefined, pairs);
        if (subDocument)
            return subDocument;
        if (subDocumentId === undefined)
            return defaultSubDocument;
        if (isShowErrorIfIdNotFound)
            ApiParametersChecker.showErrorString(parameterIndex, canBeUndefined, pairs);
        return null;
    }
}
