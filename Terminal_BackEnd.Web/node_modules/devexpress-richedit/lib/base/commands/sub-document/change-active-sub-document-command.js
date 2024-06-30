import { MapCreator } from '../../../base-utils/map-creator';
import { HeaderFooterInvalidatorHelper } from '../../../core/layout-formatter/invalidator/header-footer-invalidator-helper';
import { LayoutPageFlags } from '../../../core/layout/main-structures/layout-page';
import { SubDocumentInfoType } from '../../../core/model/enums';
import { AnchorObjectHorizontalPositionType } from '../../../core/model/floating-objects/enums';
import { ChangeFooterIndexHistoryItem, ChangeHeaderIndexHistoryItem } from '../../../core/model/history/items/header-footer-history-items';
import { ModelIterator } from '../../../core/model/model-iterator';
import { AnchoredPictureRun } from '../../../core/model/runs/anchored-picture-run';
import { AnchoredTextBoxRun } from '../../../core/model/runs/anchored-text-box-run';
import { RunType } from '../../../core/model/runs/run-type';
import { SectionHeadersFooters } from '../../../core/model/section/header-footer';
import { Section } from '../../../core/model/section/section';
import { SubDocument } from '../../../core/model/sub-document';
import { SelectionIntervalsInfo } from '../../../core/selection/selection-intervals-info';
import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { isEven } from '@devexpress/utils/lib/utils/common';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { ReadOnlyMode } from '../../interfaces/i-rich-edit-core';
import { ScrollState } from '../../scroll/model-states';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandOptions, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { HeaderFooterCommandBase } from '../header-footer/header-footer-command-base';
class FindPageIndexHelper {
    getPageIndex(control, subDoc) {
        let pageIndex = 0;
        for (let page; page = control.layoutFormatterManager.forceFormatPage(pageIndex); pageIndex++)
            if (ListUtils.elementBy(this.getPageAreas(page.getLayoutOtherPageAreasInfo()), (pa) => pa && pa.subDocument.id == subDoc.id))
                break;
        return MathUtils.restrictValue(pageIndex, 0, control.selection.layout.pages.length - 1);
    }
}
class FindHeaderPageIndexHelper extends FindPageIndexHelper {
    getPageAreas(layoutPageHeaderFooterPageAreas) {
        return [layoutPageHeaderFooterPageAreas.headerPageArea];
    }
}
class FindFooterPageIndexHelper extends FindPageIndexHelper {
    getPageAreas(layoutPageHeaderFooterPageAreas) {
        return [layoutPageHeaderFooterPageAreas.footerPageArea];
    }
}
class FindTextBoxPageIndexHelper extends FindPageIndexHelper {
    getPageAreas(layoutPageHeaderFooterPageAreas) {
        return layoutPageHeaderFooterPageAreas.textBoxesPageAreas;
    }
}
export class ChangeActiveSubDocumentToHeaderFooterByPageIndexCommandParameters extends CommandOptions {
    constructor(control, pageIndex, isHeader) {
        super(control);
        this.pageIndex = pageIndex;
        this.isHeader = isHeader;
    }
}
export class ChangeActiveSubDocumentCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    finishChanges(newPageIndex, newActiveSubDoc, startSelection) {
        const selection = this.selection;
        if (!this.setNewSelectionProps(selection, this.control.modelManager.model, newPageIndex, newActiveSubDoc))
            return false;
        startSelection = this.validateSelectionPosition(newActiveSubDoc, startSelection);
        selection.changeState((newState) => newState.setPosition(startSelection).resetKeepX().setEndOfLine(false).setSubDocument(newActiveSubDoc).setPageIndex(newPageIndex));
        if (this.isNeedScrollAfter())
            selection.scrollManager.setScroll(new ScrollState().byModelPosition(selection).setModelPosition(startSelection).useStdRelativePosition().useStdOffset());
        return true;
    }
    canSetSelectionBeforeRun(run) {
        return !((run instanceof AnchoredPictureRun || run instanceof AnchoredTextBoxRun) &&
            run.anchorInfo.horizontalPositionType != AnchorObjectHorizontalPositionType.Character);
    }
    validateSelectionPosition(subDocument, position) {
        const iterator = new ModelIterator(subDocument, true);
        iterator.setPosition(position);
        do
            if (iterator.charOffset > 0 || this.canSetSelectionBeforeRun(iterator.run))
                break;
        while (iterator.moveToNextRun());
        return iterator.getAbsolutePosition();
    }
    invalidatePages(targetPageIndex, currActiveSubDocInfo) {
        if (currActiveSubDocInfo.isHeaderFooter) {
            const headerFooterInvalidatorHelper = new HeaderFooterInvalidatorHelper(this.control.modelManager.model, this.control.layout, currActiveSubDocInfo.headerFooterType);
            headerFooterInvalidatorHelper.initByPageIndex(targetPageIndex);
            this.control.layoutFormatterManager.invalidator.onPagesChanged(headerFooterInvalidatorHelper.startPageIndex, headerFooterInvalidatorHelper.endPageIndex);
        }
        else
            this.control.layoutFormatterManager.invalidator.onPagesChanged(targetPageIndex, targetPageIndex + 1);
    }
    setNewSelectionProps(selection, model, newPageIndex, newSubDocument) {
        if (selection.pageIndex == newPageIndex && newSubDocument == selection.activeSubDocument)
            return false;
        if (newSubDocument.isTextBox() && (!selection.specialRunInfo.isSelectedAnchorObject ||
            selection.specialRunInfo.getTextBoxInnerSubDocumentId() != newSubDocument.id)) {
            const parentSubDoc = model.subDocuments[newSubDocument.info.parentSubDocumentId];
            const iterator = new ModelIterator(parentSubDoc, true);
            iterator.setPosition(0);
            do
                if (iterator.run.getType() == RunType.AnchoredTextBoxRun && iterator.run.subDocId == newSubDocument.id)
                    break;
            while (iterator.moveToNextRun());
            selection.specialRunInfo.init(SelectionIntervalsInfo.fromInterval(parentSubDoc, new FixedInterval(iterator.getAbsolutePosition(), 1)), this.modelManipulator.model);
        }
        return true;
    }
    isNeedScrollAfter() {
        return false;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
export class ChangeActiveSubDocumentToMainCommand extends ChangeActiveSubDocumentCommandBase {
    executeCore(_state, options) {
        const selection = this.selection;
        const targetPageIndex = selection.pageIndex;
        if (targetPageIndex < 0)
            return false;
        this.invalidatePages(targetPageIndex, options.subDocument.info);
        let targetLayoutPage = this.control.layoutFormatterManager.forceFormatPage(targetPageIndex);
        if (!targetLayoutPage)
            targetLayoutPage = selection.layout.getLastValidPage();
        return this.finishChanges(-1, this.control.modelManager.model.mainSubDocument, targetLayoutPage ? targetLayoutPage.getPosition() : 0);
    }
}
export class ChangeActiveSubDocumentToHeaderFooterByPageIndexCommand extends ChangeActiveSubDocumentCommandBase {
    executeCore(_state, params) {
        const targetPageIndex = params.pageIndex;
        if (targetPageIndex >= this.control.layout.pages.length)
            return false;
        this.invalidatePages(targetPageIndex, this.selection.activeSubDocument.info);
        const targetLayoutPage = this.control.layoutFormatterManager.forceFormatPage(targetPageIndex);
        if (!targetLayoutPage)
            return false;
        this.history.beginTransaction();
        const newSubDocument = this.getNewSubDocument(targetLayoutPage, params.isHeader);
        if (!newSubDocument)
            return false;
        const res = this.finishChanges(targetPageIndex, newSubDocument, 0);
        this.history.endTransaction();
        return res;
    }
    getNewSubDocument(layoutPage, isHeader) {
        const pageAreas = layoutPage.getLayoutOtherPageAreasInfo();
        const pageArea = isHeader ? pageAreas.headerPageArea : pageAreas.footerPageArea;
        if (pageArea)
            return pageArea.subDocument;
        if (this.control.modelManager.model.isDocumentProtectionEnabled || this.control.readOnly == ReadOnlyMode.Persistent)
            return null;
        const sections = this.control.modelManager.model.sections;
        const sectionIndex = Section.getPageSectionIndex(this.control.layoutFormatterManager.forceFormatPage(layoutPage.index), sections);
        const headerFooterType = SectionHeadersFooters.getActualObjectType(sections[sectionIndex], layoutPage.flags.get(LayoutPageFlags.IsFirstPageOfSection), isEven(layoutPage.layoutPageIndex));
        return this.insertSubDocument(isHeader, sectionIndex, headerFooterType);
    }
    insertSubDocument(isHeader, sectionIndex, headerFooterType) {
        const newObjectIndex = this.createHeaderFooter(isHeader, sectionIndex, headerFooterType);
        return HeaderFooterCommandBase.getObjectsCache(isHeader, this.control)[newObjectIndex].getSubDocument(this.control.modelManager.model);
    }
    createHeaderFooter(isHeader, sectionIndex, type) {
        const objectIndex = this.control.modelManager.modelManipulator.header.getHeaderFooterManipulator(isHeader).createObject(type);
        this.changeHeaderFooterObjectIndex(isHeader, sectionIndex, type, objectIndex);
        return objectIndex;
    }
    changeHeaderFooterObjectIndex(isHeader, sectionIndex, headerFooterType, newIndex) {
        this.history.addAndRedo(new (isHeader ? ChangeHeaderIndexHistoryItem : ChangeFooterIndexHistoryItem)(this.modelManipulator, sectionIndex, headerFooterType, newIndex, (oldIndex) => {
            if (this.control.selection.activeSubDocument.isHeaderFooter() && oldIndex == -1)
                this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain)
                    .execute(this.control.commandManager.isPublicApiCall);
        }));
    }
    isNeedScrollAfter() {
        return true;
    }
    isEnabled() {
        return super.isEnabled() && this.control.innerClientProperties.viewsSettings.isPrintLayoutView;
    }
}
export class ChangeActiveSubDocumentToHeaderFooterOrTextBoxBySubDocumentCommand extends ChangeActiveSubDocumentCommandBase {
    executeCore(_state, options) {
        const newActiveSubDoc = options.param;
        let targetPageIndex;
        if (this.selection.specialRunInfo.isTextBoxSelected() &&
            this.selection.specialRunInfo.getTextBoxInnerSubDocumentId() == newActiveSubDoc.id &&
            this.selection.pageIndex >= 0)
            targetPageIndex = this.selection.pageIndex;
        else
            targetPageIndex = newActiveSubDoc.info.getType() != SubDocumentInfoType.Main ? ChangeActiveSubDocumentToHeaderFooterBySubDocumentCommand.MapTypeToPageIndexHelper[newActiveSubDoc.info.getType()]
                .getPageIndex(this.control, newActiveSubDoc) : this.selection.pageIndex;
        this.invalidatePages(targetPageIndex, this.selection.activeSubDocument.info);
        return this.control.layoutFormatterManager.forceFormatPage(targetPageIndex) && this.finishChanges(targetPageIndex, newActiveSubDoc, 0);
    }
    isNeedScrollAfter() {
        return true;
    }
}
ChangeActiveSubDocumentToHeaderFooterOrTextBoxBySubDocumentCommand.MapTypeToPageIndexHelper = new MapCreator()
    .add(SubDocumentInfoType.Header, new FindHeaderPageIndexHelper())
    .add(SubDocumentInfoType.Footer, new FindFooterPageIndexHelper())
    .add(SubDocumentInfoType.TextBox, new FindTextBoxPageIndexHelper())
    .get();
export class ChangeActiveSubDocumentToHeaderFooterBySubDocumentCommand extends ChangeActiveSubDocumentToHeaderFooterOrTextBoxBySubDocumentCommand {
    isEnabled() {
        return super.isEnabled() && this.control.innerClientProperties.viewsSettings.isPrintLayoutView;
    }
}
export class ChangeActiveSubDocumentToTextBoxCommand extends ChangeActiveSubDocumentToHeaderFooterOrTextBoxBySubDocumentCommand {
    getState() {
        if (!this.isEnabled())
            return new SimpleCommandState(false);
        const specInfo = this.selection.specialRunInfo;
        if (!specInfo.isTextBoxSelected())
            return new SimpleCommandState(false);
        const run = this.selection.activeSubDocument.getRunByPosition(specInfo.getTextBoxPosition());
        return new SimpleCommandState(run.getType() == RunType.AnchoredTextBoxRun, this.control.modelManager.model.subDocuments[run.subDocId]);
    }
    executeCore(state, _options) {
        if (state.value instanceof SubDocument)
            return super.executeCore(state, new CommandSimpleOptions(this.control, state.value));
        throw new Error(Errors.InternalException);
    }
}
