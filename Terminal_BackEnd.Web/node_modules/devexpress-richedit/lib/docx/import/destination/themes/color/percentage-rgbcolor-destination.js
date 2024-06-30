import { ScRGBColor } from '../../../../../core/model/color/sc-rgbcolor';
import { Constants } from '@devexpress/utils/lib/constants';
import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class PercentageRGBColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        const scR = this.data.readerHelper.getIntegerValue(reader, 'r', Constants.MIN_SAFE_INTEGER);
        const scG = this.data.readerHelper.getIntegerValue(reader, 'g', Constants.MIN_SAFE_INTEGER);
        const scB = this.data.readerHelper.getIntegerValue(reader, 'b', Constants.MIN_SAFE_INTEGER);
        if ((scR == Constants.MIN_SAFE_INTEGER) || (scG == Constants.MIN_SAFE_INTEGER) || (scB == Constants.MIN_SAFE_INTEGER))
            this.data.options.throwInvalidFile('Invalid sc color');
        this.colorModelInfo.scRgb = new ScRGBColor(scR, scG, scB);
    }
}
