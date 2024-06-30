import { LayoutPositionCreatorConflictFlags, LayoutPositionMainSubDocumentCreator } from '../../../core/layout-engine/layout-position-creator';
import { DocumentLayoutDetailsLevel } from '../../../core/layout/document-layout-details-level';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ModelScrollManager } from '../../scroll/model-scroll-manager';
import { ScrollState } from '../../scroll/model-states';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class GoToStartPageCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(_state, _options) {
        const selection = this.selection;
        const subDocument = this.selection.activeSubDocument;
        const layout = this.control.layout;
        const position = selection.lastSelectedInterval.start;
        const pageIndex = subDocument.isMain() ?
            LayoutPositionMainSubDocumentCreator.ensureLayoutPosition(this.control.layoutFormatterManager, subDocument, position, DocumentLayoutDetailsLevel.Page, new LayoutPositionCreatorConflictFlags().setDefault(selection.endOfLine), new LayoutPositionCreatorConflictFlags().setDefault(true)).pageIndex :
            selection.pageIndex;
        const newPageIndex = this.getNewPageIndex(pageIndex);
        const page = this.control.layoutFormatterManager.forceFormatPage(newPageIndex);
        const newPosition = (page ? page : ListUtils.last(layout.pages)).getPosition();
        if (selection.isCollapsed() && position == newPosition)
            return false;
        this.setNewSelection(newPosition);
        selection.scrollManager.setScroll(new ScrollState().byModelPosition(selection)
            .setModelPosition(newPosition)
            .useStdRelativePosition()
            .useStdOffset());
        return true;
    }
}
export class GoToStartNextPageCommand extends GoToStartPageCommandBase {
    getNewPageIndex(pageIndex) {
        return pageIndex + 1;
    }
    setNewSelection(newPosition) {
        this.selection.deprecatedSetSelection(newPosition, newPosition, false, -1, true, true, true, ModelScrollManager.DontChangeScrollPosition);
    }
}
export class GoToStartPrevPageCommand extends GoToStartPageCommandBase {
    getNewPageIndex(pageIndex) {
        return Math.max(0, pageIndex - 1);
    }
    setNewSelection(newPosition) {
        this.selection.deprecatedSetSelection(newPosition, newPosition, false, -1, true, true, true, ModelScrollManager.DontChangeScrollPosition);
    }
}
export class ExtendGoToStartNextPageCommand extends GoToStartNextPageCommand {
    setNewSelection(position) {
        this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false));
    }
}
export class ExtendGoToStartPrevPageCommand extends GoToStartPrevPageCommand {
    setNewSelection(position) {
        this.selection.changeState((newState) => newState.extendLastInterval(position).resetKeepX().setEndOfLine(false));
    }
}
