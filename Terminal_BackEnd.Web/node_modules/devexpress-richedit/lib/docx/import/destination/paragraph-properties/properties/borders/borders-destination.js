import { MapCreator } from '../../../../../../base-utils/map-creator';
import { Errors } from '@devexpress/utils/lib/errors';
import { ParagraphFormattingLeafElementDestination } from '../../paragraph-formatting-leaf-element-destination';
import { ParagraphBetweenBorderDestination } from './between-border-destination';
import { ParagraphBottomBorderDestination } from './bottom-border-destination';
import { ParagraphLeftBorderDestination } from './left-border-destination';
import { ParagraphRightBorderDestination } from './right-border-destination';
import { ParagraphTopBorderDestination } from './top-border-destination';
export class ParagraphBordersDestination extends ParagraphFormattingLeafElementDestination {
    static getThis(data) {
        return data.destinationStack.getThis();
    }
    get elementHandlerTable() {
        return ParagraphBordersDestination.handlerTable;
    }
    getDescriptor() {
        throw new Error(Errors.InternalException);
    }
}
ParagraphBordersDestination.handlerTable = new MapCreator()
    .add('top', (data, _reader) => new ParagraphTopBorderDestination(data, ParagraphBordersDestination.getThis(data).paragraphProperties))
    .add('left', (data, _reader) => new ParagraphLeftBorderDestination(data, ParagraphBordersDestination.getThis(data).paragraphProperties))
    .add('bottom', (data, _reader) => new ParagraphBottomBorderDestination(data, ParagraphBordersDestination.getThis(data).paragraphProperties))
    .add('right', (data, _reader) => new ParagraphRightBorderDestination(data, ParagraphBordersDestination.getThis(data).paragraphProperties))
    .add('between', (data, _reader) => new ParagraphBetweenBorderDestination(data, ParagraphBordersDestination.getThis(data).paragraphProperties))
    .get();
