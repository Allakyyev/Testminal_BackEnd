import { ParagraphPropertyDescriptor } from '../../../../../../core/model/paragraph/paragraph-properties';
import { ParagraphBorderDestination } from './border-destination';
export class ParagraphBetweenBorderDestination extends ParagraphBorderDestination {
    getDescriptor() {
        return ParagraphPropertyDescriptor.betweenBorder;
    }
}
