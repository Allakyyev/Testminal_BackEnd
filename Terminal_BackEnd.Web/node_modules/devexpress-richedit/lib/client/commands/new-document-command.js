import { CommandBase } from '../../base/commands/command-base';
import { SimpleCommandState } from '../../base/commands/command-states';
import { DocumentInfo } from '../../base/rich-edit-core';
import { ModelCreator } from '../../core/model/creator/creator';
import { FontCorrector } from '../../core/model/creator/font-corrector';
import { ModelCreatorOptions } from '../../core/model/creator/options';
import { ControlOptions, DocumentCapability } from '../../core/model/options/control';
export class NewDocumentCommand extends CommandBase {
    getState() {
        var state = new SimpleCommandState(this.isEnabled());
        state.visible = this.control.modelManager.richOptions.control.createNew !== DocumentCapability.Hidden;
        return state;
    }
    executeCore(_state, _options) {
        if (this.control.getModifiedState() && !this.control.owner.confirmOnLosingChanges())
            return false;
        NewDocumentCommand.newDocumentInner.call(this);
        this.control.owner.raiseDocumentLoaded();
        return true;
    }
    static newDocumentInner() {
        this.control.closeDocument();
        this.control.loadingPanelManager.loadingPanel.setVisible(true);
        const documentInfo = new DocumentInfo(DocumentInfo.defaultDocumentName, false);
        this.control.initialize("", documentInfo, 1, null);
        const options = new ModelCreatorOptions();
        new ModelCreator(options).setModel(this.control.modelManager.model).fillModel();
        new FontCorrector(this.control.modelManager.modelManipulator, this.control.modelManager.model, this.control.modelManager.richOptions.fonts).correct();
        this.control.selection.beginUpdate();
        const selectionUpdated = this.control.selection.changeState((newState) => newState.setPosition(0).resetKeepX().setEndOfLine(false)
            .setPageIndex(-1).setSubDocument(this.control.modelManager.model.mainSubDocument));
        this.control.modelManager.modelManipulator.documentProtectionProperties.filterRangePermissions();
        this.control.layoutFormatterManager.openDocument();
        this.control.layout.pageColor = this.control.modelManager.model.getActualPageBackgroundColor();
        this.control.layoutFormatterManager.forceFormatPage(0);
        this.control.inputPosition.reset();
        this.control.horizontalRulerControl.setEnable(true);
        this.control.selection.endUpdate();
        if (!selectionUpdated)
            this.control.selection.raiseSelectionChanged();
        this.control.layoutFormatterManager.runFormattingAsync();
        this.control.loadingPanelManager.loadingPanel.setVisible(false);
        this.control.barHolder.forceUpdate();
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.createNew);
    }
    isEnabledInClosedDocument() {
        return true;
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
}
