import { DrawingColorModelInfo } from '../../../../../core/model/drawing/drawing-color-model-info';
import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class HexRGBColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        this.colorModelInfo.rgb = DrawingColorModelInfo.sRgbToRgb(this.data.readerHelper.readAttribute(reader, 'val'));
    }
}
