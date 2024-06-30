import { TabLeaderType } from '../../../core/layout/main-structures/layout-boxes/layout-tab-space-box';
import { DeleteTabAtParagraphHistoryItem, InsertTabToParagraphHistoryItem } from '../../../core/model/history/items/paragraph-properties-history-items';
import { ControlOptions } from '../../../core/model/options/control';
import { TabInfo } from '../../../core/model/paragraph/paragraph-style';
import { RichUtils } from '../../../core/model/rich-utils';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { SearchUtils } from '@devexpress/utils/lib/utils/search';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export var RulerTabAction;
(function (RulerTabAction) {
    RulerTabAction[RulerTabAction["None"] = 0] = "None";
    RulerTabAction[RulerTabAction["Insert"] = 1] = "Insert";
    RulerTabAction[RulerTabAction["Delete"] = 2] = "Delete";
})(RulerTabAction || (RulerTabAction = {}));
export class TabRulerCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.paragraphTabs);
    }
    executeCore(_state, options) {
        const info = RichUtils.getSelectedParagraphs(options.intervalsInfo.intervals, options.subDocument);
        this.history.beginTransaction();
        this.executeHistoryItems(this.modelManipulator, options.subDocument, info.intervals[0], info.paragraphs[0], options.param);
        this.history.endTransaction();
        return true;
    }
    findTabByPosition(paragraph, position) {
        var index = SearchUtils.binaryIndexOf(paragraph.tabs.tabsInfo, (a) => a.position - position);
        return index > -1 ? paragraph.tabs.tabsInfo[index] : null;
    }
    getIntervalsForModifying() {
        return RichUtils.getIntervalsOfSelectedParagraphs(this.selection.intervals, this.selection.activeSubDocument);
    }
}
export class InsertTabToParagraphCommand extends TabRulerCommandBase {
    executeHistoryItems(modelManipulator, subDocument, interval, _firstParagraph, params) {
        var tabInfo = new TabInfo(UnitConverter.pixelsToTwips(params.position), params.align, TabLeaderType.None, false, false);
        this.history.addAndRedo(new InsertTabToParagraphHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), tabInfo));
    }
}
export class DeleteTabAtParagraphCommand extends TabRulerCommandBase {
    executeHistoryItems(modelManipulator, subDocument, interval, firstParagraph, params) {
        var tabInfo = this.findTabByPosition(firstParagraph, UnitConverter.pixelsToTwips(params));
        this.history.addAndRedo(new DeleteTabAtParagraphHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), tabInfo));
    }
}
export class MoveTabRulerInParagraphCommand extends TabRulerCommandBase {
    executeHistoryItems(modelManipulator, subDocument, interval, firstParagraph, params) {
        var oldTabInfo = this.findTabByPosition(firstParagraph, UnitConverter.pixelsToTwips(params.start));
        var newTabInfo = oldTabInfo.clone();
        newTabInfo.position = UnitConverter.pixelsToTwips(params.end);
        this.history.addAndRedo(new DeleteTabAtParagraphHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), oldTabInfo));
        this.history.addAndRedo(new InsertTabToParagraphHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, interval), newTabInfo));
    }
}
