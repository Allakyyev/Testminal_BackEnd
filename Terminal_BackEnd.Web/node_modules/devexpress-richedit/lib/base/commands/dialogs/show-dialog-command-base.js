import { Browser } from '@devexpress/utils/lib/browser';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ShowDialogCommandBase extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    executeCore(state, options) {
        const params = this.createParameters(options);
        const initParams = params.clone();
        params.applyConverter(this.control.uiUnitConverter.twipsToUI);
        this.control.owner.showDialog(this.getDialogName(), params, (result) => {
            if (result) {
                result.applyConverter(this.control.uiUnitConverter.UIToTwips);
                this.control.beginUpdate();
                this.applyParameters(state, result, initParams);
                this.control.barHolder.forceUpdate(this.getRelatedCommands());
                this.control.endUpdate();
            }
            if (!Browser.TouchUI && this.isModal())
                this.control.focusManager.captureFocus();
        }, () => {
            if (!Browser.TouchUI)
                this.control.focusManager.captureFocus();
            this.afterClosing(options);
        }, this.isModal());
        return true;
    }
    applyParameters(_state, _newParameters, _oldParameters) {
        return false;
    }
    afterClosing(_options) { }
    isModal() {
        return true;
    }
}
export class DialogParametersBase {
    copyFrom(_obj) { }
}
export var DialogTitleText;
(function (DialogTitleText) {
    DialogTitleText[DialogTitleText["SaveAsFile"] = 0] = "SaveAsFile";
    DialogTitleText[DialogTitleText["OpenFile"] = 1] = "OpenFile";
    DialogTitleText[DialogTitleText["Font"] = 2] = "Font";
    DialogTitleText[DialogTitleText["Paragraph"] = 3] = "Paragraph";
    DialogTitleText[DialogTitleText["PageSetup"] = 4] = "PageSetup";
    DialogTitleText[DialogTitleText["Columns"] = 5] = "Columns";
    DialogTitleText[DialogTitleText["InsertImage"] = 6] = "InsertImage";
    DialogTitleText[DialogTitleText["Error"] = 7] = "Error";
})(DialogTitleText || (DialogTitleText = {}));
