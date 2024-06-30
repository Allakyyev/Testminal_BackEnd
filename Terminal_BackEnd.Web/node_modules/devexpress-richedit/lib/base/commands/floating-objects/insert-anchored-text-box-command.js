import { ColorHelper } from '../../../core/model/color/color';
import { AnchorInfo } from '../../../core/model/floating-objects/anchor-info';
import { RelativeHeightType, RelativeWidthType } from '../../../core/model/floating-objects/enums';
import { AnchorTextBoxSize } from '../../../core/model/floating-objects/sizes';
import { TextBoxProperties } from '../../../core/model/floating-objects/text-box-properties';
import { NonVisualDrawingObjectInfo } from '../../../core/model/manipulators/picture-manipulator/non-visual-drawing-object-info';
import { BaseTextBoxInfo } from '../../../core/model/manipulators/text-box-manipulator';
import { ControlOptions } from '../../../core/model/options/control';
import { Shape } from '../../../core/model/shapes/shape';
import { SubDocumentPosition } from '../../../core/model/sub-document';
import { UnitConverter } from '@devexpress/utils/lib/class/unit-converter';
import { Margins } from '@devexpress/utils/lib/geometry/margins';
import { Size } from '@devexpress/utils/lib/geometry/size';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { ColorUtils } from '@devexpress/utils/lib/utils/color';
import { SelectionHistoryItem } from '../../model/history/selection/selection-history-item';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class InsertAnchoredTextBoxCommand extends CommandBase {
    getState() {
        return new SimpleCommandState(this.isEnabled());
    }
    canModify() {
        return !this.control.modelManager.model.isDocumentProtectionEnabled;
    }
    isEnabled() {
        const subDoc = this.selection.activeSubDocument;
        return super.isEnabled() &&
            ControlOptions.isEnabled(this.control.modelManager.richOptions.control.floatingObjects) &&
            (subDoc.isMain() || subDoc.isHeaderFooter()) &&
            !this.selection.specialRunInfo.isTextBoxSelected();
    }
    executeCore(_state, options) {
        const history = this.history;
        const topBottomMargin = UnitConverter.inchesToTwips(0.05);
        const leftRightMargin = UnitConverter.inchesToTwips(0.1);
        const absoluteSize = new Size(UnitConverter.inchesToTwips(2), UnitConverter.inchesToTwips(0.3));
        const relativeSize = new Size(AnchorTextBoxSize.RELATIVE_COEFF * 0.40, AnchorTextBoxSize.RELATIVE_COEFF * 0.20);
        let size = new AnchorTextBoxSize(false, 0, absoluteSize, relativeSize, RelativeWidthType.Margin, RelativeHeightType.Margin, false, false);
        let contentMargins = new Margins(leftRightMargin, leftRightMargin, topBottomMargin, topBottomMargin);
        let textBoxProperties = new TextBoxProperties(contentMargins);
        const anchorInfo = new AnchorInfo();
        anchorInfo.zOrder = this.modelManipulator.floatingObject.zOrder.getNewZOrder(options.subDocument);
        anchorInfo.layoutTableCell = true;
        history.addTransaction(() => {
            this.modelManipulator.textBox.insertAnchoredTextBoxViaHistoty(new SubDocumentPosition(this.selection.activeSubDocument, this.selection.lastSelectedInterval.start), this.inputPosition.charPropsBundle, new BaseTextBoxInfo(null, size, new Shape(ColorUtils.fromString(ColorUtils.colorNames.white), ColorHelper.BLACK_COLOR, UnitConverter.pointsToTwips(3.0 / 4)), anchorInfo, textBoxProperties, new NonVisualDrawingObjectInfo()));
            this.history.addAndRedo(new SelectionHistoryItem(this.modelManipulator, this.selection, this.selection.getState(), this.selection.getState().setInterval(new FixedInterval(this.selection.lastSelectedInterval.start, 1))));
            this.control.commandManager.getCommand(RichEditClientCommand.ChangeActiveSubDocumentToTextBox)
                .execute(this.control.commandManager.isPublicApiCall, options);
        });
        return true;
    }
}
