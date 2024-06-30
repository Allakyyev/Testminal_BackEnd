import { ModelChangeType } from '../model/changes/enums';
import { RichUtils } from '../model/rich-utils';
export class SpellCheckerModelChangesListener {
    constructor(spellChecker) {
        this.spellChecker = spellChecker;
    }
    modelChanged(change) {
        switch (change.type) {
            case ModelChangeType.InlinePictureInserted:
            case ModelChangeType.AnchoredPictureInserted:
            case ModelChangeType.ParagraphInserted:
            case ModelChangeType.AnchoredTextBoxInserted: {
                this.spellChecker.onModelIntervalChanged(change.position, 1, true);
                break;
            }
            case ModelChangeType.SimpleRunInserted: {
                this.spellChecker.onModelIntervalChanged(change.position, change.length, change.length == 1 && RichUtils.isWhitespace.test(change.text));
                break;
            }
            case ModelChangeType.AnchorObjectRemoved: {
                break;
            }
            case ModelChangeType.IntervalRemoved: {
                this.spellChecker.onModelIntervalChanged(change.interval.start, -change.interval.length, false);
                break;
            }
            case ModelChangeType.ParagraphMerged: {
                this.spellChecker.onModelIntervalChanged(change.position, -1, false);
                break;
            }
        }
    }
}
export class SpellCheckerLayoutChangesListener {
    constructor(spellChecker) {
        this.spellChecker = spellChecker;
    }
    NotifyPagesReady(_pageChanges) {
        this.spellChecker.onLayoutChanged();
    }
    NotifyFullyFormatted(_pageCount) { }
    ;
}
