import { LeafElementDestination } from '../destination';
export class ParagraphFormattingLeafElementDestination extends LeafElementDestination {
    constructor(data, paragraphProperties) {
        super(data);
        this.paragraphProperties = paragraphProperties;
    }
    setProperty(newValue) {
        this.paragraphProperties.setValue(this.getDescriptor(), newValue);
    }
}
