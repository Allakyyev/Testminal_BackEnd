import { AnchorObjectTextWrapType } from '../../../core/model/floating-objects/enums';
import { RunType } from '../../../core/model/runs/run-type';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { RichEditClientCommand } from '../client-command';
import { CommandBase } from '../command-base';
import { SimpleCommandState } from '../command-states';
export class SetFloatingObjectTextWrapTypeCommandBase extends CommandBase {
    constructor() {
        super(...arguments);
        this.isBehindDoc = false;
    }
    getRelatedCommands() {
        return {
            [RichEditClientCommand.SetFloatingObjectSquareTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectTightTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectThroughTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectTopAndBottomTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectBehindTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectInFrontOfTextWrapType]: true,
            [RichEditClientCommand.SetFloatingObjectInlineTextWrapType]: true
        };
    }
    getState() {
        return new SimpleCommandState(this.isEnabled(), this.getStateValue());
    }
    getStateValue() {
        let value = false;
        if (this.isEnabled()) {
            const specialRunInfo = this.selection.specialRunInfo;
            let anchoredRun = specialRunInfo.getParentSubDocument()
                .getRunByPosition(specialRunInfo.getPosition());
            if (anchoredRun && anchoredRun.anchorInfo && anchoredRun.anchorInfo.wrapType === this.anchorObjectTextWrapType &&
                anchoredRun.anchorInfo.isBehindDoc === this.isBehindDoc)
                value = true;
        }
        return value;
    }
    canModify() {
        return true;
    }
    isEnabled() {
        return super.isEnabled() && this.isEnabledCore() &&
            this.getFloatingObjectParentSubDocument().isEditable([new FixedInterval(this.selection.specialRunInfo.getPosition(), 1)]);
    }
    isEnabledCore() {
        return this.selection.specialRunInfo.isSelected();
    }
    executeCore(_state, _parameter) {
        const specialRunInfo = this.selection.specialRunInfo;
        const subDocument = specialRunInfo.getParentSubDocument();
        const position = specialRunInfo.getPosition();
        this.modelManipulator.picture.setFloatingObjectTextWrapType(subDocument, position, this.inputPosition.charPropsBundle, this.isBehindDoc, this.anchorObjectTextWrapType);
        return true;
    }
}
export class SetFloatingObjectSquareTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.Square;
    }
}
export class SetFloatingObjectTightTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.Tight;
    }
}
export class SetFloatingObjectThroughTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.Through;
    }
}
export class SetFloatingObjectTopAndBottomTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.TopAndBottom;
    }
}
export class SetFloatingObjectInFrontOfTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.None;
    }
}
export class SetFloatingObjectBehindTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    constructor() {
        super(...arguments);
        this.anchorObjectTextWrapType = AnchorObjectTextWrapType.None;
        this.isBehindDoc = true;
    }
}
export class SetFloatingObjectInlineTextWrapTypeCommand extends SetFloatingObjectTextWrapTypeCommandBase {
    getStateValue() {
        let value = false;
        if (this.isEnabled()) {
            let run = this.selection.activeSubDocument.getRunByPosition(this.selection.specialRunInfo.getPicturePosition());
            if (run.getType() === RunType.InlinePictureRun)
                value = true;
        }
        return value;
    }
    isEnabledCore() {
        return this.selection.specialRunInfo.isPictureSelected();
    }
    executeCore(_state, _options) {
        this.modelManipulator.picture.setFloatingObjectInlineTextWrapType(this.selection.activeSubDocument, this.selection.specialRunInfo.getPicturePosition(), this.inputPosition.charPropsBundle);
        return true;
    }
}
