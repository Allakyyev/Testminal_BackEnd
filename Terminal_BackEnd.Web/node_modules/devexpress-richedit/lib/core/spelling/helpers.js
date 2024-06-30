import { ModelIterator } from '../model/model-iterator';
import { RichUtils } from '../model/rich-utils';
import { RunType } from '../model/runs/run-type';
export class ModelWordPositionHelper {
    static getWordStartPosition(subDocument, position) {
        return ModelWordPositionHelper.getWordStartPositionByCharCondition(subDocument, position, (char) => { return RichUtils.isWhitespace.test(char); });
    }
    static getWordStartPositionByCharCondition(subDocument, position, condition) {
        let iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(position);
        while (iterator.moveToPrevChar()) {
            let char = iterator.getCurrentChar();
            let runType = iterator.run.getType();
            if (condition(char) || runType == RunType.ParagraphRun || runType == RunType.SectionRun)
                return iterator.getAbsolutePosition() + 1;
        }
        return iterator.getAbsolutePosition();
    }
    static getPrevWordStartPosition(subDocument, position) {
        let iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(position);
        let firstWhitespaceIsFound = false;
        let prevWordIsFound = false;
        while (iterator.moveToPrevChar()) {
            let char = iterator.getCurrentChar();
            let runType = iterator.run.getType();
            if ((RichUtils.isWhitespace.test(char) && prevWordIsFound) || runType == RunType.ParagraphRun || runType == RunType.SectionRun)
                return iterator.getAbsolutePosition() + 1;
            if (RichUtils.isWhitespace.test(char))
                firstWhitespaceIsFound = true;
            else if (firstWhitespaceIsFound)
                prevWordIsFound = true;
        }
        return iterator.getAbsolutePosition();
    }
    static getNextWordEndPosition(subDocument, position) {
        let iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(position);
        let firstWhitespaceIsFound = false;
        let nextWordIsFound = false;
        do {
            let char = iterator.getCurrentChar();
            let runType = iterator.run.getType();
            if ((RichUtils.isWhitespace.test(char) && nextWordIsFound) || runType == RunType.ParagraphRun || runType == RunType.SectionRun)
                return iterator.getAbsolutePosition() - 1;
            if (RichUtils.isWhitespace.test(char))
                firstWhitespaceIsFound = true;
            else if (firstWhitespaceIsFound)
                nextWordIsFound = true;
        } while (iterator.moveToNextChar());
        return iterator.getAbsolutePosition();
    }
}
