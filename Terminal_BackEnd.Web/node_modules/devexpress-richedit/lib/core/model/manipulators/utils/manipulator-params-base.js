import { Errors } from '@devexpress/utils/lib/errors';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { Log } from '../../../rich-utils/debug/logger/base-logger/log';
export class ManipulatorParamsBase {
    constructor(needCorrectParams, needCheckParams) {
        this.needCorrectParams = needCorrectParams;
        this.needCheckParams = needCheckParams;
    }
    fail(exceptionString) {
        if (Log.isDebug)
            throw new Error(exceptionString);
        return false;
    }
    correctAndCheckParams() {
        if (this.needCorrectParams)
            this.correctParams();
        if (this.needCheckParams)
            if (!this.checkParams())
                return false;
        return true;
    }
    innerCheck(paramOk, exceptionString) {
        if (!paramOk)
            this.fail(exceptionString);
        return paramOk;
    }
}
export class ManipulatorParamsPositionBased extends ManipulatorParamsBase {
    constructor(subDocPos) {
        super(true, true);
        this.subDocPos = subDocPos;
    }
    correctParams() {
        const documentEndPosition = this.subDocPos.subDocument.getDocumentEndPosition();
        this.subDocPos.position = MathUtils.restrictValue(this.subDocPos.position, 0, documentEndPosition - 1);
    }
    checkParams() {
        const documentEndPosition = this.subDocPos.subDocument.getDocumentEndPosition();
        return this.innerCheck(this.subDocPos.position >= 0 && this.subDocPos.position < documentEndPosition, Errors.InternalException);
    }
}
export class ManipulatorParamsCharacterPropertiesBased extends ManipulatorParamsPositionBased {
    constructor(subDocPos, charPropsBundle) {
        super(subDocPos);
        this.charPropsBundle = charPropsBundle;
    }
    checkParams() {
        return super.checkParams() &&
            this.innerCheck(!!this.charPropsBundle.props, Errors.InternalException) &&
            this.innerCheck(!!this.charPropsBundle.style, Errors.InternalException);
    }
}
