import { InsertParagraphManipulatorParams } from '../../core/model/manipulators/paragraph-manipulator/insert-paragraph-manipulator-params';
import { InsertTextManipulatorParams } from '../../core/model/manipulators/text-manipulator/insert-text-manipulator-params';
import { RunType } from '../../core/model/runs/run-type';
import { SubDocumentPosition } from '../../core/model/sub-document';
import { InputPositionBase } from '../../core/selection/input-position-base';
import { SelectionIntervalsInfo } from '../../core/selection/selection-intervals-info';
import { IntervalAlgorithms } from '@devexpress/utils/lib/intervals/algorithms';
import { BoundaryInterval } from '@devexpress/utils/lib/intervals/boundary';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
export function insertTextThroughApi(position, text, subDocument, processor, options) {
    var _a, _b;
    if (!text.length)
        return new FixedInterval(position, 0);
    const inputPos = (_a = options === null || options === void 0 ? void 0 : options.inputPosition) !== null && _a !== void 0 ? _a : new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(subDocument, position));
    const wrapIntoBeginUpdate = (_b = options === null || options === void 0 ? void 0 : options.wrapIntoBeginUpdate) !== null && _b !== void 0 ? _b : true;
    if (wrapIntoBeginUpdate)
        processor.beginUpdate();
    processor.modelManager.history.beginTransaction();
    const parMarkRegexp = new RegExp(/\r\n|\n|\r/g);
    const stringLength = text.length;
    const getNextParMarkPos = offset => {
        parMarkRegexp.lastIndex = offset;
        const result = parMarkRegexp.exec(text);
        return result ? result.index : -1;
    };
    let paragraphSymbolPostion = getNextParMarkPos(0);
    let fromPos = 0;
    let toPos = position;
    const resultIntervals = [];
    while (fromPos < stringLength) {
        let insertedTextLength;
        if (paragraphSymbolPostion == fromPos) {
            resultIntervals.push(processor.modelManager.modelManipulator.paragraph.insertParagraphViaHistory(InsertParagraphManipulatorParams.makeParamsByPosition(new SubDocumentPosition(subDocument, toPos), inputPos)));
            insertedTextLength = text.substr(paragraphSymbolPostion, 2) == '\r\n' ? 2 : 1;
            paragraphSymbolPostion = getNextParMarkPos(fromPos + insertedTextLength);
        }
        else {
            const paragraphEndPos = paragraphSymbolPostion == -1 ? stringLength : paragraphSymbolPostion;
            const paragraphText = text.substring(fromPos, paragraphEndPos);
            resultIntervals.push(processor.modelManager.modelManipulator.text.insertTextViaHistory(new InsertTextManipulatorParams(new SubDocumentPosition(subDocument, toPos), inputPos.charPropsBundle, RunType.TextRun, paragraphText)).insertedInterval);
            insertedTextLength = paragraphText.length;
        }
        toPos += insertedTextLength;
        fromPos += insertedTextLength;
    }
    processor.modelManager.history.endTransaction();
    if (wrapIntoBeginUpdate)
        processor.endUpdate();
    const mergedIntervals = IntervalAlgorithms.getMergedIntervals(resultIntervals, true);
    return new BoundaryInterval(mergedIntervals[0].start, ListUtils.last(mergedIntervals).end);
}
