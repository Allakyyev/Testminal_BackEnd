import { RichUtils } from '../../rich-utils';
import { RunType } from '../../runs/run-type';
import { ManipulatorParamsCharacterPropertiesBased } from '../utils/manipulator-params-base';
export class InsertTextManipulatorParams extends ManipulatorParamsCharacterPropertiesBased {
    constructor(subDocPos, charPropsBundle, runType, text) {
        super(subDocPos, charPropsBundle);
        this.text = text;
        this.runType = runType;
    }
    clone() {
        const obj = new InsertTextManipulatorParams(this.subDocPos, this.charPropsBundle, this.runType, this.text);
        return obj;
    }
}
export class InsertLayoutDependentTextManipulatorParams extends InsertTextManipulatorParams {
    constructor(subDocPos, charPropsBundle) {
        super(subDocPos, charPropsBundle, RunType.LayoutDependentRun, RichUtils.specialCharacters.LayoutDependentText);
    }
}
