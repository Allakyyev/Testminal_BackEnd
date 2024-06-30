import { Constants } from '@devexpress/utils/lib/constants';
import { LeafElementDestination } from '../../../destination';
export class ColorTransformDestinationBase extends LeafElementDestination {
    constructor(data, color) {
        super(data);
        this.color = color;
    }
    getIntegerValue(reader) {
        return this.data.readerHelper.getIntegerValue(reader, 'val', Constants.MIN_SAFE_INTEGER);
    }
}
