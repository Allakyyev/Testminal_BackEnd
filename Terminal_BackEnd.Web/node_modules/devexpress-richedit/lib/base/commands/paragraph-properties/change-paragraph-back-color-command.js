import { ColorHelper } from '../../../core/model/color/color';
import { ColorModelInfo } from '../../../core/model/color/color-model-info';
import { ParagraphPropertyDescriptor } from '../../../core/model/paragraph/paragraph-properties';
import { ShadingInfo } from '../../../core/model/shadings/shading-info';
import { ListUtils } from '@devexpress/utils/lib/utils/list';
import { ChangeFontShadingInfoCommand } from '../character-properties/change-font-back-color-command';
import { ChangeParagraphPropertiesCommandBase } from './change-paragraph-properties-command-base';
export class ChangeParagraphBackColorCommand extends ChangeParagraphPropertiesCommandBase {
    executeCore(_state, options) {
        const subDocument = options.subDocument;
        const intervals = this.selection.intervals;
        let isParagraphBackColorChanged = this.control.commandManager.isPublicApiCall || this.selection.isCollapsed() || ListUtils.unsafeAnyOf(intervals, (interval) => {
            const paragraphs = subDocument.getParagraphsByInterval(interval);
            return paragraphs.length > 1 || interval.contains(paragraphs[0].getEndPosition() - 1);
        });
        if (isParagraphBackColorChanged)
            return super.executeCore(_state, options);
        else {
            const fontShadingInfoCommand = new ChangeFontShadingInfoCommand(this.control);
            return fontShadingInfoCommand.execute(this.control.commandManager.isPublicApiCall, options);
        }
    }
    getDescriptor() {
        return ParagraphPropertyDescriptor.shadingInfo;
    }
    getValueForState(val) {
        return val ? val.getActualColor(this.colorProvider) : undefined;
    }
    isLockUpdateValue() {
        return true;
    }
    DEPRECATEDConvertOptionsParameter(parameter) {
        return ShadingInfo.createByColor(ColorModelInfo.makeByColor(ColorHelper.anyToColor(parameter, ColorHelper.NO_COLOR)));
    }
}
