import { SelectionIntervalsInfo } from '../../selection/selection-intervals-info';
import { CharacterPropertyDescriptor } from './character-property-descriptor';
export class CharacterPropertiesApplier {
    constructor(modelManager, inputPosition, newCharProps, subDocument, intervals) {
        this.modelManager = modelManager;
        this.inputPosition = inputPosition;
        this.newCharProps = newCharProps;
        this.modelManip = this.modelManager.modelManipulator;
        this.subDoc = subDocument;
        this.intervals = intervals;
    }
    apply() {
        const history = this.modelManager.history;
        this.maskedCharProps = this.inputPosition.getMaskedCharacterProperties();
        this.charPropsRaw = this.inputPosition.getMergedCharacterPropertiesRaw();
        this.charPropsFull = this.inputPosition.getMergedCharacterPropertiesFull();
        this.charPropsRaw = this.inputPosition.getMergedCharacterPropertiesRaw();
        this.oldCharPropsRaw = this.charPropsRaw.clone();
        let changed = 0;
        history.beginTransaction();
        changed |= this.applyProp(CharacterPropertyDescriptor.allCaps);
        changed |= this.applyProp(CharacterPropertyDescriptor.size);
        changed |= this.applyProp(CharacterPropertyDescriptor.bold);
        changed |= this.applyProp(CharacterPropertyDescriptor.italic);
        changed |= this.applyProp(CharacterPropertyDescriptor.fontInfo);
        changed |= this.applyProp(CharacterPropertyDescriptor.script);
        changed |= this.applyProp(CharacterPropertyDescriptor.strikeoutType);
        changed |= this.applyProp(CharacterPropertyDescriptor.underlineType);
        changed |= this.applyProp(CharacterPropertyDescriptor.underlineWordsOnly);
        changed |= this.applyProp(CharacterPropertyDescriptor.strikeoutWordsOnly);
        changed |= this.applyProp(CharacterPropertyDescriptor.noProof);
        changed |= this.applyProp(CharacterPropertyDescriptor.hidden);
        changed |= this.applyProp(CharacterPropertyDescriptor.textColor);
        changed |= this.applyProp(CharacterPropertyDescriptor.shadingInfo);
        changed |= this.applyProp(CharacterPropertyDescriptor.highlightColor);
        changed |= this.applyProp(CharacterPropertyDescriptor.strikeoutColor);
        changed |= this.applyProp(CharacterPropertyDescriptor.underlineColor);
        changed |= this.applyProp(CharacterPropertyDescriptor.langInfo);
        changed |= this.applyProp(CharacterPropertyDescriptor.smallCaps);
        history.endTransaction();
        return !!changed;
    }
    applyProp(descriptor) {
        const newValue = descriptor.getProp(this.newCharProps);
        const currValue = descriptor.getProp(this.oldCharPropsRaw);
        if (newValue !== undefined && newValue !== currValue) {
            descriptor.setProp(this.maskedCharProps, newValue);
            descriptor.setProp(this.charPropsRaw, newValue);
            descriptor.setProp(this.charPropsFull, newValue);
            this.maskedCharProps.setUseValue(descriptor.maskValue(), true);
            for (let interval of this.intervals)
                if (interval.length > 0)
                    this.modelManager.history.addAndRedo(new (descriptor.getHistoryItemConstructor())(this.modelManip, new SelectionIntervalsInfo(this.subDoc, [interval]), newValue, true));
            return 1;
        }
        return 0;
    }
}
