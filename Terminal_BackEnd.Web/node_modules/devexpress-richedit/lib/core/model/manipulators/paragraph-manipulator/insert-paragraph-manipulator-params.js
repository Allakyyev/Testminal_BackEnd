import { Errors } from '@devexpress/utils/lib/errors';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { MathUtils } from '@devexpress/utils/lib/utils/math';
import { MaskedCharacterPropertiesBundle, MaskedParagraphPropertiesBundleFull, ParagraphListInfo } from '../../../rich-utils/properties-bundle';
import { InputPositionBase } from '../../../selection/input-position-base';
import { SelectionIntervalsInfo } from '../../../selection/selection-intervals-info';
import { ApplyParagraphStyleHistoryItem } from '../../history/items/apply-style-history-items';
import { RichUtils } from '../../rich-utils';
import { SubDocumentInterval, SubDocumentPosition } from '../../sub-document';
import { ManipulatorParamsCharacterPropertiesBased } from '../utils/manipulator-params-base';
export class InsertParagraphManipulatorParams extends ManipulatorParamsCharacterPropertiesBased {
    constructor(subDocPos, charPropsBundle, parPropsBundle = MaskedParagraphPropertiesBundleFull.notSetted, applyDirectlyToNewParagraph = true, actionAfter = () => { }) {
        super(subDocPos, charPropsBundle);
        this.parPropsBundle = parPropsBundle;
        this.applyDirectlyToNewParagraph = applyDirectlyToNewParagraph;
        this.actionAfter = actionAfter;
    }
    correctParams() {
        const documentEndPosition = this.subDocPos.subDocument.getDocumentEndPosition();
        this.subDocPos.position = MathUtils.restrictValue(this.subDocPos.position, 0, documentEndPosition);
    }
    checkParams() {
        const documentEndPosition = this.subDocPos.subDocument.getDocumentEndPosition();
        return this.innerCheck(this.subDocPos.position >= 0 && this.subDocPos.position <= documentEndPosition, Errors.InternalException) &&
            this.innerCheck(!!this.charPropsBundle.props, Errors.InternalException) &&
            this.innerCheck(!!this.charPropsBundle.style, Errors.InternalException);
    }
    clone() {
        const obj = new InsertParagraphManipulatorParams(this.subDocPos, this.charPropsBundle, this.parPropsBundle, this.applyDirectlyToNewParagraph, this.actionAfter);
        return obj;
    }
    static makeParamsByPosition(subDocPosition, inpPos = new InputPositionBase().setIntervals(SelectionIntervalsInfo.fromPosition(subDocPosition.subDocument, subDocPosition.position))) {
        const subDocument = subDocPosition.subDocument;
        const position = subDocPosition.position;
        let characterStyle = inpPos.getCharacterStyle();
        let maskedCharacterProperties = inpPos.getMaskedCharacterProperties();
        const currentParagraph = subDocument.getRunByPosition(position).paragraph;
        const nextParagraphStyle = currentParagraph.paragraphStyle ? currentParagraph.paragraphStyle.nextParagraphStyle : null;
        const needToSetNextStyle = nextParagraphStyle && (currentParagraph.getEndPosition() - 1 == position);
        const needToUseCurrentParagraphLastRunAsSource = currentParagraph.isInList() && !needToSetNextStyle;
        let actionAfter = () => { };
        if (needToUseCurrentParagraphLastRunAsSource) {
            const paragraphLastRun = subDocument.getRunByPosition(currentParagraph.getEndPosition() - 1);
            maskedCharacterProperties = paragraphLastRun.maskedCharacterProperties.clone();
            characterStyle = paragraphLastRun.characterStyle;
        }
        else {
            const startPosition = position + RichUtils.specialCharacters.ParagraphMark.length;
            if (needToSetNextStyle && subDocument.isEditable([new FixedInterval(startPosition, 1)]))
                actionAfter = (modelManager) => {
                    modelManager.history.addAndRedo(new ApplyParagraphStyleHistoryItem(modelManager.modelManipulator, new SubDocumentInterval(subDocument, new FixedInterval(startPosition, 0)), modelManager.model.stylesManager.addParagraphStyle(nextParagraphStyle)));
                };
        }
        return new InsertParagraphManipulatorParams(new SubDocumentPosition(subDocument, position), new MaskedCharacterPropertiesBundle(maskedCharacterProperties, characterStyle), new MaskedParagraphPropertiesBundleFull(undefined, undefined, ParagraphListInfo.default, undefined), false, actionAfter);
    }
}
