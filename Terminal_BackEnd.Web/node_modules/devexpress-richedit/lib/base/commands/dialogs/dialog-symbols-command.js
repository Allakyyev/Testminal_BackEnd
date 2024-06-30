import { CharacterPropertiesMask } from '../../../core/model/character/enums';
import { FontNameHistoryItem } from '../../../core/model/history/items/character-properties-history-items';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { RichEditClientCommand } from '../client-command';
import { CommandSimpleOptions } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
import { DialogParametersBase, ShowDialogCommandBase } from './show-dialog-command-base';
export class DialogSymbolsCommandBase extends ShowDialogCommandBase {
    getDialogName() {
        return "Symbols";
    }
}
export class DialogSymbolsCommand extends DialogSymbolsCommandBase {
    getState() {
        return new IntervalCommandStateEx(this.isEnabled(), ListUtils.deepCopy(this.selection.intervalsInfo.intervals));
    }
    createParameters(_options) {
        var charProps = this.inputPosition.getMergedCharacterPropertiesRaw();
        var parameters = new DialogSymbolsParameters();
        parameters.fontName = charProps.fontInfo ? charProps.fontInfo.name : this.control.modelManager.model.defaultCharacterProperties.fontInfo.name;
        return parameters;
    }
    applyParameters(state, newParams) {
        this.history.beginTransaction();
        var modelManipulator = this.modelManipulator;
        var maskedCharacterProperties = this.inputPosition.getMaskedCharacterProperties();
        var fontInfo = this.control.modelManager.model.cache.fontInfoCache.getItemByName(newParams.fontName) || null;
        maskedCharacterProperties.fontInfo = fontInfo;
        maskedCharacterProperties.setUseValue(CharacterPropertiesMask.UseFontName, true);
        for (let i = 0, interval; interval = state.intervals[i]; i++) {
            if (interval.length > 0)
                this.history.addAndRedo(new FontNameHistoryItem(modelManipulator, new SubDocumentInterval(this.selection.activeSubDocument, interval), fontInfo, true));
        }
        this.control.commandManager.getCommand(RichEditClientCommand.InsertText)
            .execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, newParams.symbol));
        this.history.endTransaction();
        return true;
    }
}
export class DialogServiceSymbolsCommand extends DialogSymbolsCommandBase {
    createParameters(options) {
        this.dialogCustomNumberingListParameters = options.param;
        var parameters = new DialogSymbolsParameters();
        parameters.fontName = options.param.levels[options.param.currentLevel].fontName;
        return parameters;
    }
    applyParameters(_state, newParams) {
        var level = this.dialogCustomNumberingListParameters.levels[this.dialogCustomNumberingListParameters.currentLevel];
        level.fontName = newParams.fontName;
        level.displayFormatString = newParams.symbol;
        return false;
    }
    afterClosing() {
        var clientCommand = RichEditClientCommand.ShowCustomNumberingListForm;
        this.control.commandManager.getCommand(clientCommand).execute(this.control.commandManager.isPublicApiCall, new CommandSimpleOptions(this.control, this.dialogCustomNumberingListParameters));
    }
}
export class DialogSymbolsParameters extends DialogParametersBase {
    copyFrom(obj) {
        super.copyFrom(obj);
        this.symbol = obj.symbol;
        this.fontName = obj.fontName;
    }
    clone() {
        const newInstance = new DialogSymbolsParameters();
        newInstance.copyFrom(this);
        return newInstance;
    }
    applyConverter(_converter) {
        return this;
    }
}
