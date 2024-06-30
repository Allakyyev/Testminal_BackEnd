import { boolToInt } from '@devexpress/utils/lib/utils/common';
import { ListLevelProperties } from '../../../numbering-lists/list-level-properties';
import { JSONListLevelProperty } from '../../enums/json-list-enums';
export class JSONListLevelPropertiesConverter {
    static convertFromJSON(obj) {
        const result = new ListLevelProperties();
        result.start = obj[JSONListLevelProperty.Start];
        result.format = obj[JSONListLevelProperty.Format];
        result.convertPreviousLevelNumberingToDecimal = !!obj[JSONListLevelProperty.ConvertPreviousLevelNumberingToDecimal];
        result.suppressBulletResize = !!obj[JSONListLevelProperty.SuppressBulletResize];
        result.suppressRestart = !!obj[JSONListLevelProperty.SuppressRestart];
        result.alignment = obj[JSONListLevelProperty.Alignment];
        result.displayFormatString = obj[JSONListLevelProperty.DisplayFormatString];
        result.relativeRestartLevel = obj[JSONListLevelProperty.RelativeRestartLevel];
        result.separator = obj[JSONListLevelProperty.Separator];
        result.templateCode = obj[JSONListLevelProperty.TemplateCode];
        result.originalLeftIndent = obj[JSONListLevelProperty.OriginalLeftIndent];
        result.legacy = !!obj[JSONListLevelProperty.Legacy];
        result.legacySpace = obj[JSONListLevelProperty.LegacySpace];
        result.legacyIndent = obj[JSONListLevelProperty.LegacyIndent];
        return result;
    }
    static convertToJSON(source) {
        const result = {};
        result[JSONListLevelProperty.Start] = source.start;
        result[JSONListLevelProperty.Format] = source.format;
        result[JSONListLevelProperty.ConvertPreviousLevelNumberingToDecimal] = boolToInt(source.convertPreviousLevelNumberingToDecimal);
        result[JSONListLevelProperty.SuppressBulletResize] = boolToInt(source.suppressBulletResize);
        result[JSONListLevelProperty.SuppressRestart] = boolToInt(source.suppressRestart);
        result[JSONListLevelProperty.Alignment] = source.alignment;
        result[JSONListLevelProperty.DisplayFormatString] = source.displayFormatString;
        result[JSONListLevelProperty.RelativeRestartLevel] = source.relativeRestartLevel;
        result[JSONListLevelProperty.Separator] = source.separator;
        result[JSONListLevelProperty.TemplateCode] = source.templateCode;
        result[JSONListLevelProperty.OriginalLeftIndent] = source.originalLeftIndent;
        result[JSONListLevelProperty.Legacy] = boolToInt(source.legacy);
        result[JSONListLevelProperty.LegacySpace] = source.legacySpace;
        result[JSONListLevelProperty.LegacyIndent] = source.legacyIndent;
        return result;
    }
}
