import { SchemeColorValues } from '../../../../../core/model/themes/enums';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class SchemeColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        const schemeColor = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.schemeColorTable.importMap, SchemeColorValues.Empty);
        if (schemeColor == SchemeColorValues.Empty)
            this.data.options.throwInvalidFile('Invalid scheme color');
        this.colorModelInfo.schemeColor = schemeColor;
    }
}
