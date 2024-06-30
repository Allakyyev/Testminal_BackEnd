import { ColorHelper } from '../../../core/model/color/color';
import { ControlOptions } from '../../../core/model/options/control';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { isNumber } from '@devexpress/utils/lib/utils/common';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class ChangeTableBorderColorRepositoryItemCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true, false);
        let tableInfo = this.selection.tableInfo;
        state.enabled = this.isEnabled() && tableInfo.extendedData.numRows > 0;
        state.denyUpdateValue = true;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        this.control.modelManager.model.repositoryBorderItem.color = this.control.modelManager.model.colorProvider.getModelColorFromRgba(options.param);
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return isNumber(parameter) ? parameter :
            (!parameter || parameter == ColorHelper.AUTOMATIC_COLOR.toString() ?
                ColorHelper.AUTOMATIC_COLOR : ColorUtils.fromString(parameter));
    }
}
export class ChangeTableBorderWidthRepositoryItemCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true, false);
        state.enabled = this.isEnabled() && this.selection.tableInfo.extendedData.numRows > 0;
        state.value = this.control.modelManager.model.repositoryBorderItem.width;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        this.control.modelManager.model.repositoryBorderItem.width = options.param;
        return true;
    }
}
export class ChangeTableBorderStyleRepositoryItemCommand extends CommandBase {
    getState() {
        let state = new SimpleCommandState(true, false);
        state.enabled = this.isEnabled() && this.selection.tableInfo.extendedData.numRows > 0;
        state.value = this.control.modelManager.model.repositoryBorderItem.style;
        return state;
    }
    isEnabled() {
        return super.isEnabled() && ControlOptions.isEnabled(this.control.modelManager.richOptions.control.tables);
    }
    executeCore(_state, options) {
        this.control.modelManager.model.repositoryBorderItem.style = options.param;
        return true;
    }
}
