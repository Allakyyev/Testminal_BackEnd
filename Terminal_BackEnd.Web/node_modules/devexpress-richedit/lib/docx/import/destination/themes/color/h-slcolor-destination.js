import { ColorHSL } from '../../../../../core/model/color/color-hsl';
import { Constants } from '@devexpress/utils/lib/constants';
import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class HSLColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        const hue = this.data.readerHelper.getIntegerValue(reader, 'hue', Constants.MIN_SAFE_INTEGER);
        const sat = this.data.readerHelper.getIntegerValue(reader, 'sat', Constants.MIN_SAFE_INTEGER);
        const lum = this.data.readerHelper.getIntegerValue(reader, 'lum', Constants.MIN_SAFE_INTEGER);
        if ((hue == Constants.MIN_SAFE_INTEGER) || (sat == Constants.MIN_SAFE_INTEGER) || (lum == Constants.MIN_SAFE_INTEGER))
            this.data.options.throwInvalidFile('Incorrect hsl value');
        this.colorModelInfo.hsl = new ColorHSL(hue, sat, lum);
    }
}
