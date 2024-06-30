import { LayoutBoxIteratorMainSubDocument } from '../../../layout-engine/layout-box-iterator/layout-box-iterator-main-sub-document';
import { LayoutBoxIteratorOtherSubDocument } from '../../../layout-engine/layout-box-iterator/layout-box-iterator-other-sub-document';
import { DocumentLayoutDetailsLevel } from '../../../layout/document-layout-details-level';
import { LayoutBoxType } from '../../../layout/main-structures/layout-boxes/layout-box';
import { RichUtils } from '../../../model/rich-utils';
import { WordGroupMask } from '../../layout-word-bounds';
export class LayoutWordBoundsIterator {
    constructor(layout, subDocument, selection, startPosition, endPosition) {
        this.isInitOk = true;
        this.isFirstCallNextSymbol = true;
        if (layout.validPageCount < 1) {
            this.startResultPosition = -1;
            this.isInitOk = false;
            return;
        }
        this.boxIterator = subDocument.isMain() ?
            new LayoutBoxIteratorMainSubDocument(subDocument, layout, startPosition, endPosition) :
            new LayoutBoxIteratorOtherSubDocument(subDocument, layout, startPosition, endPosition, selection.pageIndex);
    }
    isSet() {
        if (!this.isInitOk)
            return false;
        if (this.boxIterator.isInitialized())
            return true;
        this.startResultPosition = -1;
        return false;
    }
    currSymbolStartPosition() {
        return this.boxIterator.position.getLogPosition(DocumentLayoutDetailsLevel.Box) + this.charOffset;
    }
    getNextSymbolGroup() {
        if (!this.getNextSymbol())
            return false;
        this.groupMask = this.getGroupMask();
        return true;
    }
    getNextSymbol() {
        if (this.isFirstCallNextSymbol) {
            this.isFirstCallNextSymbol = false;
            if (!this.moveIterator())
                return false;
            this.charOffset = this.boxIterator.position.charOffset;
            if (this.needExcessMoveBoxIterator())
                this.moveIterator();
            return true;
        }
        if (this.nextCallsSetCharOffset())
            return true;
        if (!this.moveIterator())
            return false;
        this.setCharacterOffsetOnNextCalls();
        return true;
    }
    getGroupMask() {
        switch (this.boxIterator.position.box.getType()) {
            case LayoutBoxType.Text:
                return this.getTextGroupMask();
            case LayoutBoxType.Space:
                return WordGroupMask.Space;
            case LayoutBoxType.Dash:
                return WordGroupMask.PunctuationMark;
            case LayoutBoxType.Picture:
            case LayoutBoxType.ParagraphMark:
            case LayoutBoxType.PageBreak:
            case LayoutBoxType.ColumnBreak:
            case LayoutBoxType.SectionMark:
            case LayoutBoxType.TabSpace:
            case LayoutBoxType.LineBreak:
            case LayoutBoxType.NumberingList:
            case LayoutBoxType.FieldCodeStart:
            case LayoutBoxType.FieldCodeEnd:
            case LayoutBoxType.LayoutDependent:
            case LayoutBoxType.AnchorPicture:
            case LayoutBoxType.AnchorTextBox:
            default:
                return WordGroupMask.DiffersFromAll;
        }
    }
    getTextGroupMask() {
        switch (this.boxIterator.position.box.renderGetContent(null)[this.charOffset]) {
            case RichUtils.specialCharacters.QmSpace:
            case RichUtils.specialCharacters.EmSpace:
            case RichUtils.specialCharacters.EnSpace:
            case RichUtils.specialCharacters.NonBreakingSpace:
                return WordGroupMask.Space;
            case RichUtils.specialCharacters.LeftSingleQuote:
                return WordGroupMask.LeftSingleQuote;
            case RichUtils.specialCharacters.LeftDoubleQuote:
                return WordGroupMask.LeftDoubleQuote;
            case RichUtils.specialCharacters.RightDoubleQuote:
                return WordGroupMask.RightDoubleQuote;
            case '"':
                return WordGroupMask.DoubleQuote;
            case "(":
            case ")":
            case "«":
            case "»":
            case "<":
            case ">":
            case "/":
            case "№":
            case "%":
            case "!":
            case ":":
            case "?":
            case ";":
            case "|":
            case "+":
            case ",":
            case ".":
            case "*":
            case "=":
            case "\\":
                return WordGroupMask.PunctuationMark;
            default:
                return WordGroupMask.Others;
        }
    }
}
