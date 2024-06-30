import { ShadingInfo } from '../../../../core/model/shadings/shading-info';
import { ShadingPattern } from '../../../../core/model/shadings/shading-pattern';
import { TranslationTables } from '../../../translation-table/translation-tables';
import { OpenXmlColorImportHelper } from '../../color/open-xml-color-import-helper';
export class ShadingHelper {
    static getShadingValue(data, reader) {
        const colorCache = data.documentModel.cache.colorModelInfoCache;
        const shadingPattern = data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.shadingPatternTable.importMap, ShadingPattern.Clear);
        const foreColorModelInfo = colorCache.getItem(OpenXmlColorImportHelper.createColorModelInfo(data, reader, 'color'));
        const backColorModelInfo = colorCache.getItem(OpenXmlColorImportHelper.createFillInfo(data, reader));
        return data.documentModel.cache.shadingInfoCache.getItem(new ShadingInfo(shadingPattern, backColorModelInfo, foreColorModelInfo));
    }
}
