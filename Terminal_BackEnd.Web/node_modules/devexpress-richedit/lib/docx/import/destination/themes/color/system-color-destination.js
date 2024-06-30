import { SystemColorValues } from '../../../../../core/model/themes/enums';
import { TranslationTables } from '../../../../translation-table/translation-tables';
import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class SystemColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        const systemColor = this.data.readerHelper.getWpEnumValue(reader, 'val', TranslationTables.systemColorTable.importMap, SystemColorValues.Empty);
        if (systemColor == SystemColorValues.Empty)
            this.data.options.throwInvalidFile('Invalid color values');
        this.colorModelInfo.systemColor = systemColor;
    }
}
