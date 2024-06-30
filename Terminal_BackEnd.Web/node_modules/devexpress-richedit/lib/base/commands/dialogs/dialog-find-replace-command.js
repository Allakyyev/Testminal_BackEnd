import { BackwardCharacterIterator, ForwardCharacterIterator } from '../../../core/model/find-replace-helper';
import { SimpleCommandState } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogFindReplaceCommand extends ShowDialogCommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    createParameters(_options) {
        var parameters = new FindReplaceDialogParameters();
        parameters.controller = this.control.searchManager;
        return parameters;
    }
    applyParameters(_state, _params) {
        return true;
    }
    getDialogName() {
        return "FindReplace";
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    isModal() {
        return false;
    }
    static getTextForResult(control, subDocument, interval) {
        let entryContextRadius = 20;
        let paragraphInterval = subDocument.getParagraphByPosition(interval.start).interval;
        let searchPartText = DialogFindReplaceCommand.getTextForward(control, subDocument, interval.start, interval.end, interval.length);
        let leftPartText = DialogFindReplaceCommand.getTextBackward(control, subDocument, interval.start, paragraphInterval.start, entryContextRadius);
        let rightPartText = DialogFindReplaceCommand.getTextForward(control, subDocument, interval.end, paragraphInterval.end, entryContextRadius);
        let resultText = `${encodeHtml(leftPartText)}${`<b>${encodeHtml(searchPartText)}</b>`}${encodeHtml(rightPartText)}`;
        return resultText;
    }
    static getTextForward(control, subDocument, startPosition, endPosition, length) {
        let text = "";
        const charIterator = new ForwardCharacterIterator(control.modelManager, control.layoutFormatterManager, control.selection.pageIndex, subDocument, startPosition, endPosition);
        while (charIterator.nextChar() && text.length < length)
            text += charIterator.char;
        return charIterator.iterator.intervalEnd > charIterator.getCurrLogPosition() && text.length === length && charIterator.nextChar() ? text + "..." : text;
    }
    static getTextBackward(control, subDocument, startPosition, endPosition, length) {
        let text = "";
        const charIterator = new BackwardCharacterIterator(control.modelManager, control.layoutFormatterManager, control.selection.pageIndex, subDocument, endPosition, startPosition);
        while (charIterator.prevChar() && text.length < length)
            text = charIterator.char + text;
        return charIterator.iterator.intervalStart < charIterator.getCurrLogPosition() && text.length === length && charIterator.prevChar() ? "..." + text : text;
    }
}
export class FindReplaceDialogParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.controller = obj.controller;
    }
    clone() {
        const newInstance = new FindReplaceDialogParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
function encodeHtml(html) {
    const replTable = [
        [/&amp;/g, '&ampx;'], [/&/g, '&amp;'],
        [/&quot;/g, '&quotx;'], [/"/g, '&quot;'],
        [/&lt;/g, '&ltx;'], [/</g, '&lt;'],
        [/&gt;/g, '&gtx;'], [/>/g, '&gt;']
    ];
    for (var i = 0; i < replTable.length; i++) {
        var replacement = replTable[i];
        html = html.replace(replacement[0], replacement[1]);
    }
    return html;
}
