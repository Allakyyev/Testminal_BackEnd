import { LangInfo } from '../../../core/model/character/lang-info';
import { DXColor } from '../../../core/model/color/dx-color';
import { CultureInfo } from '../../../core/model/themes/culture-info';
import { Constants } from '@devexpress/utils/lib/constants';
import { Comparers } from '@devexpress/utils/lib/utils/comparers';
import { StringMapUtils } from '@devexpress/utils/lib/utils/map/string';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { DocxNsType } from '../../utils/constants';
import { StringValueParser } from '../../utils/string-value-parser';
import { UnitsConverter } from '../../utils/units-converter';
import { XmlCharsDecoder } from '../../utils/xml-chars-decoder';
import { CultureInfoHelper } from './culture-info-helper';
import { MarkupLanguageColorParser } from './markup-language-color-parser';
export class ReaderHelper {
    constructor(data) {
        this.data = data;
    }
    searchInTable(value, table, defaultValue, extendedSearch = true) {
        const val = table[value];
        if (val !== undefined)
            return val.modelValue;
        if (extendedSearch) {
            const foundByBruteForce = StringMapUtils.elementBy(table, (elem) => elem.mlValue.openXmlValue == value || elem.mlValue.wordMLValue == value);
            return foundByBruteForce !== null ? foundByBruteForce.modelValue : defaultValue;
        }
        return defaultValue;
    }
    readAttribute(reader, attributeName) {
        const result = reader.getAttributeNS(attributeName, this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        return StringUtils.isNullOrEmpty(result) ? reader.getAttribute(attributeName) : result;
    }
    readAttributeWithNs(reader, attributeName, ns) {
        return reader.getAttributeNS(attributeName, ns);
    }
    isBool(value) { return value == 't'; }
    isBoolStrict(value) {
        if (value == '1' || value == 'on' || value == 'true' || value == 't')
            return true;
        if (value == '0' || value == 'off' || value == 'false' || value == 'f')
            return false;
        this.data.options.throwInvalidFile('Not expected Bool value');
        return false;
    }
    decodeXmlChars(val) {
        return XmlCharsDecoder.decode(val);
    }
    getWpSTOnOffValue(reader, attributeName, defaultValue = true) {
        const value = this.readAttribute(reader, attributeName);
        return this.getOnOffValueBool(value, defaultValue);
    }
    getOnOffValue(reader, attributeName, defaultValue = true) {
        const value = reader.getAttributeNS(attributeName, null);
        return this.getOnOffValueBool(value, defaultValue);
    }
    getOnOffValueBool(value, defaultValue) {
        return StringUtils.isNullOrEmpty(value) ? defaultValue : this.isBoolStrict(value);
    }
    getWpSTOnOffNullValue(reader, attributeName) {
        return StringUtils.isNullOrEmpty(reader.getAttribute(attributeName)) ?
            null :
            this.getWpSTOnOffValue(reader, attributeName);
    }
    getWpSTIntegerValue(reader, attributeName, defaultValue = Constants.MIN_SAFE_INTEGER, radix = 10) {
        const value = this.readAttribute(reader, attributeName);
        return this.getIntegerValueCore(value, defaultValue, radix);
    }
    getIntegerValueInPoints(reader, attributeName, defaultValue) {
        const value = reader.getAttribute(attributeName);
        return StringUtils.isNullOrEmpty(value) ?
            Constants.MIN_SAFE_INTEGER :
            this.getIntegerValueCore(value.replace('pt', ''), defaultValue);
    }
    getIntegerValue(reader, attributeName, defaultValue) {
        const value = reader.getAttribute(attributeName);
        return this.getIntegerValueCore(value, defaultValue);
    }
    parseIntStrict(value, radix) {
        if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
            return parseInt(value, radix);
        return NaN;
    }
    parseFloatStrict(value) {
        if (/^(\-|\+)?([0-9.,]+|Infinity)$/.test(value))
            return Number(value);
        return NaN;
    }
    getIntegerValueCore(value, defaultValue, radix = 10) {
        if (StringUtils.isNullOrEmpty(value))
            return defaultValue;
        const intResultStrict = this.parseIntStrict(value, radix);
        if (!isNaN(intResultStrict))
            return intResultStrict;
        const floatResultStrict = this.parseFloatStrict(value);
        if (!isNaN(floatResultStrict))
            return floatResultStrict;
        if (this.data.constants.strictMode) {
            const valueInfo = StringValueParser.parse(value);
            return Math.round(UnitsConverter.valueUnitToModelUnitsF(valueInfo));
        }
        if (this.data.options.allowIntPercentage && StringUtils.endsAt(value, '%')) {
            value = value.substring(0, value.length - 1);
            const val = parseInt(value, 10);
            if (!isNaN(val))
                return val * 1000;
        }
        if (this.data.options.ignoreParseErrors)
            return defaultValue;
        const intResult = parseInt(value, radix);
        if (!isNaN(intResult))
            return intResult;
        const floatResult = parseFloat(value);
        if (!isNaN(floatResult))
            return floatResult;
        this.data.options.throwInvalidFile('Not expected integer value');
        return null;
    }
    getIntegerNullableValue(reader, attr) {
        const value = this.readAttribute(reader, attr);
        return StringUtils.isNullOrEmpty(value) ?
            null :
            this.getIntegerValueCore(value, Constants.MIN_SAFE_INTEGER);
    }
    getFloatValueInPoints(reader, attributeName, defaultValue) {
        const value = reader.getAttribute(attributeName);
        return StringUtils.isNullOrEmpty(value) ?
            Constants.MIN_SAFE_INTEGER :
            this.getFloatValue(value.replace('pt', ''), defaultValue);
    }
    getFloatValue(value, defaultValue) {
        if (StringUtils.isNullOrEmpty(value))
            return defaultValue;
        const res = parseFloat(value);
        return isNaN(res) ? Constants.MIN_SAFE_INTEGER : res;
    }
    getWpEnumValue(reader, attributeName, table, defaultValue, ns) {
        const value = ns == undefined ?
            this.readAttribute(reader, attributeName) :
            this.readAttributeWithNs(reader, attributeName, ns);
        return StringUtils.isNullOrEmpty(value) ? defaultValue : this.getWpEnumValueCore(value, table, defaultValue);
    }
    getWpEnumValueCore(value, table, defaultValue) {
        return this.searchInTable(value, table, defaultValue, true);
    }
    getWpEnumOnOffNullValue(reader, attributeName, table) {
        const value = this.readAttribute(reader, attributeName);
        return StringUtils.isNullOrEmpty(value) ? null : this.getWpEnumOnOffNullValueCore(value, table);
    }
    getWpSTColorOrNullValue(reader, attributeName) {
        const value = reader.getAttributeNS(attributeName, this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        if (StringUtils.isNullOrEmpty(value))
            return null;
        return this.parseColor(value, DXColor.empty);
    }
    getWpSTColorValue(reader, attributeName, defaultValue = DXColor.empty) {
        const value = reader.getAttributeNS(attributeName, this.data.constants.namespaces[DocxNsType.WordProcessing].namespace);
        return StringUtils.isNullOrEmpty(value) ? defaultValue : this.parseColor(value, defaultValue);
    }
    parseColor(value, defaultValue) {
        if (value == 'auto')
            return defaultValue;
        const result = MarkupLanguageColorParser.parseColor(value);
        return result == DXColor.empty ? defaultValue : result;
    }
    convertToInt(value) {
        return this.getIntegerValueCore(value, Constants.MIN_SAFE_INTEGER, 16);
    }
    readLanguage(reader) {
        const bidi = this.createCultureInfoFromString(reader.getAttributeNS('bidi', this.data.constants.wordProcessingNamespaceConst));
        const eastAsia = this.createCultureInfoFromString(reader.getAttributeNS('eastAsia', this.data.constants.wordProcessingNamespaceConst));
        const latin = this.createCultureInfoFromString(reader.getAttributeNS('val', this.data.constants.wordProcessingNamespaceConst));
        return new LangInfo(bidi ? bidi.name : null, eastAsia ? eastAsia.name : null, latin ? latin.name : null);
    }
    getWpEnumOnOffNullValueCore(value, table) {
        return this.searchInTable(value, table, null, false);
    }
    createCultureInfoFromString(value) {
        try {
            if (!StringUtils.isNullOrEmpty(value)) {
                if (Comparers.string(value, 'x-none') == 0)
                    return null;
                const cultureId = parseInt(value, 10);
                return isNaN(cultureId) ? new CultureInfo(value) : CultureInfoHelper.createCultureInfo(cultureId);
            }
        }
        catch (err) { }
        return null;
    }
}
