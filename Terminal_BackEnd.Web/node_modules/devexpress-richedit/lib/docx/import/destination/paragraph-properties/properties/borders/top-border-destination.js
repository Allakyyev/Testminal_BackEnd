import { ParagraphPropertyDescriptor } from '../../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphBorderDestination } from './border-destination';
export class ParagraphTopBorderDestination extends ParagraphBorderDestination {
    getDescriptor() {
        return ParagraphPropertyDescriptor.topBorder;
    }
}
