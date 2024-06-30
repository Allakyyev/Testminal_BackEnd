import { FontInfoCache } from '../../../../../../core/model/caches/hashed-caches/font-info-cache';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { WordProcessingMLValue } from '../../../../../translation-table/word-processing-mlvalue';
import { FontNameDestination } from '../../../character-properties/properties/font-name-destination';
export class DefaultFontNameDestination extends FontNameDestination {
    readFontName(reader) {
        const value = reader.getAttributeNS('ascii', this.data.constants.wordProcessingNamespaceConst);
        if (!StringUtils.isNullOrEmpty(value))
            return value;
        const nameByAnsi = reader.getAttributeNS(new WordProcessingMLValue('hAnsi', 'h-ansi').openXmlValue, this.data.constants.wordProcessingNamespaceConst);
        if (!StringUtils.isNullOrEmpty(nameByAnsi))
            return nameByAnsi;
        const nameByCs = reader.getAttributeNS('cs', this.data.constants.wordProcessingNamespaceConst);
        if (!StringUtils.isNullOrEmpty(nameByCs))
            return nameByCs;
        const eastAsia = reader.getAttributeNS('eastAsia', this.data.constants.wordProcessingNamespaceConst);
        if (!StringUtils.isNullOrEmpty(eastAsia))
            return eastAsia;
        return FontInfoCache.defaultFontName;
    }
}
