import { ViewType } from '../../../core/view-settings/views-settings';
import { ScrollState } from '../../scroll/model-states';
import { RichEditClientCommand } from '../client-command';
import { CommandBase, CommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeViewTypeCommand extends CommandBase {
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SwitchToSimpleView]: true,
            [RichEditClientCommand.SwitchToPrintLayoutView]: true,
            [RichEditClientCommand.ChangeViewType]: true,
            [RichEditClientCommand.ToggleShowHorizontalRuler]: true
        };
    }
    isEnabledInReadOnlyMode() {
        return true;
    }
    executeCore(_state, options) {
        if (this.control.innerClientProperties.viewsSettings.viewType != options.param) {
            if (this.selection.activeSubDocument.isHeaderFooter())
                this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToMain)
                    .execute(this.control.commandManager.isPublicApiCall, new CommandOptions(this.control));
            this.control.innerClientProperties.viewsSettings.viewType = options.param;
            this.control.onViewTypeChanged();
            this.selection.scrollManager.setScroll(new ScrollState().byModelPosition(this.selection)
                .setModelPosition(this.selection.lastSelectedInterval.start).useStdRelativePosition().useStdOffset());
            this.control.barHolder.forceUpdate({});
            return true;
        }
        return false;
    }
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.innerClientProperties.viewsSettings.viewType);
    }
    updateControlState() {
        this.control.viewManager.adjust(true);
        super.updateControlState();
    }
}
export class SwitchToPrintLayoutViewCommand extends ChangeViewTypeCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return ViewType.PrintLayout;
    }
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.innerClientProperties.viewsSettings.isPrintLayoutView);
    }
}
export class SwitchToSimpleViewCommand extends ChangeViewTypeCommand {
    DEPRECATEDConvertOptionsParameter(_parameter) {
        return ViewType.Simple;
    }
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.control.innerClientProperties.viewsSettings.isSimpleView);
    }
}
