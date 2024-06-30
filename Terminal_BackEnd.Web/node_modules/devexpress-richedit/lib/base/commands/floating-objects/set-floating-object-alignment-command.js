import { AnchorObjectHorizontalPositionAlignment, AnchorObjectHorizontalPositionType, AnchorObjectVerticalPositionAlignment, AnchorObjectVerticalPositionType } from '../../../core/model/floating-objects/enums';
import { AnchorInfoPropertyHistoryItem } from '../../../core/model/history/items/floating-objects/anchor-info-property-history-item';
import { RunType } from '../../../core/model/runs/run-type';
import { SubDocumentInterval } from '../../../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SetFloatingObjectAlignmentCommandBase extends CommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalPositionType = AnchorObjectHorizontalPositionType.Margin;
        this.anchorObjectVerticalPositionType = AnchorObjectVerticalPositionType.Margin;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetFloatingObjectTopLeftAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectTopCenterAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectTopRightAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectMiddleLeftAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectMiddleCenterAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectMiddleRightAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectBottomLeftAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectBottomCenterAlignment]: true,
            [RichEditClientCommand.SetFloatingObjectBottomRightAlignment]: true
        };
    }
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.getStateValue());
    }
    getStateValue() {
        let value = false;
        if (this.isEnabled()) {
            let specialRunInfo = this.selection.specialRunInfo;
            let anchoredRun = specialRunInfo.getParentSubDocument()
                .getRunByPosition(specialRunInfo.getPosition());
            if (anchoredRun.anchorInfo.horizontalPositionAlignment === this.anchorObjectHorizontalAlignment
                && anchoredRun.anchorInfo.verticalPositionAlignment === this.anchorObjectVerticalAlignment
                && anchoredRun.anchorInfo.horizontalPositionType === this.anchorObjectHorizontalPositionType
                && anchoredRun.anchorInfo.verticalPositionType === this.anchorObjectVerticalPositionType)
                value = true;
        }
        return value;
    }
    canModify() {
        return true;
    }
    isEnabled() {
        const specialRunInfo = this.selection.specialRunInfo;
        return super.isEnabled() && specialRunInfo.isSelected() && specialRunInfo.isSelectedAnchorObject &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(specialRunInfo.getPosition(), 1)]);
    }
    executeCore(_state, _parameter) {
        let modelManipulator = this.modelManipulator;
        let specialRunInfo = this.selection.specialRunInfo;
        let subDocument = specialRunInfo.getParentSubDocument();
        let run = subDocument.getRunByPosition(specialRunInfo.getPosition());
        let anchoredRun = run.getType() == RunType.AnchoredPictureRun ? run : run;
        if (anchoredRun.anchorInfo.horizontalPositionAlignment !== this.anchorObjectHorizontalAlignment || anchoredRun.anchorInfo.verticalPositionAlignment !== this.anchorObjectVerticalAlignment) {
            this.history.beginTransaction();
            this.history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(specialRunInfo.getPosition(), 1)), this.anchorObjectHorizontalAlignment, modelManipulator.floatingObject.anchorInfo.horizontalPositionAlignment));
            this.history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(specialRunInfo.getPosition(), 1)), this.anchorObjectVerticalAlignment, modelManipulator.floatingObject.anchorInfo.verticalPositionAlignment));
            this.history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(specialRunInfo.getPosition(), 1)), this.anchorObjectHorizontalPositionType, modelManipulator.floatingObject.anchorInfo.horizontalPositionType));
            this.history.addAndRedo(new AnchorInfoPropertyHistoryItem(modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(specialRunInfo.getPosition(), 1)), this.anchorObjectVerticalPositionType, modelManipulator.floatingObject.anchorInfo.verticalPositionType));
            this.history.endTransaction();
        }
        return true;
    }
}
export class SetFloatingObjectTopLeftAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Left;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Top;
    }
}
export class SetFloatingObjectTopCenterAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Center;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Top;
    }
}
export class SetFloatingObjectTopRightAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Right;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Top;
    }
}
export class SetFloatingObjectMiddleLeftAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Left;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Center;
    }
}
export class SetFloatingObjectMiddleCenterAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Center;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Center;
    }
}
export class SetFloatingObjectMiddleRightAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Right;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Center;
    }
}
export class SetFloatingObjectBottomLeftAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Left;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Bottom;
    }
}
export class SetFloatingObjectBottomCenterAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Center;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Bottom;
    }
}
export class SetFloatingObjectBottomRightAlignmentCommand extends SetFloatingObjectAlignmentCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectHorizontalAlignment = AnchorObjectHorizontalPositionAlignment.Right;
        this.anchorObjectVerticalAlignment = AnchorObjectVerticalPositionAlignment.Bottom;
    }
}
