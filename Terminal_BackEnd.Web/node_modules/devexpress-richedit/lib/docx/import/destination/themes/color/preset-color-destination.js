import { DrawingColorPropertiesDestinationBase } from './drawing-color-properties-destination-base';
export class PresetColorDestination extends DrawingColorPropertiesDestinationBase {
    setColorPropertyValue(reader) {
        this.colorModelInfo.preset = this.data.readerHelper.readAttribute(reader, 'val');
    }
}
