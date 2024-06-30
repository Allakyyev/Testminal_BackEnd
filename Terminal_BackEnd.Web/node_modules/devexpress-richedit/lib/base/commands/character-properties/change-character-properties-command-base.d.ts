import { ICharacterPropertyDescriptor } from '../../../core/model/character/character-property-descriptor';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { CommandBase, CommandSimpleOptions, ICommandOptions } from '../command-base';
import { IntervalCommandStateEx } from '../command-states';
export declare abstract class ChangeCharacterPropertiesCommandBase<T, StateT> extends CommandBase<IntervalCommandStateEx> {
    private _options;
    getState(options?: ICommandOptions): IntervalCommandStateEx;
    isEnabled(): boolean;
    lockInputPositionUpdating(): boolean;
    protected getIntervalsForModifying(): FixedInterval[];
    getApplyToIntervals(options: ICommandOptions): FixedInterval[];
    private _areParagraphContentInterval;
    executeCore(_state: IntervalCommandStateEx, options: CommandSimpleOptions<T>): boolean;
    protected applyToInputPosition(desc: ICharacterPropertyDescriptor<T>, newValue: T): void;
    isLockUpdateValue(): boolean;
    getCurrentValue(): T;
    getValueForState(val: T): StateT;
    protected abstract getDescriptor(): ICharacterPropertyDescriptor<T>;
    protected convertBooleanParameterToEnumType(parameter: any, ifTrue: T, ifFalse: T): T;
}
//# sourceMappingURL=change-character-properties-command-base.d.ts.map