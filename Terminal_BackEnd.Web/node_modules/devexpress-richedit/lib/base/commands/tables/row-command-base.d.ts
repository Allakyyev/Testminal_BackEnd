import { CommandBase } from '../command-base';
import { ICommandState } from '../i-command';
export declare abstract class RowCommandBase<T extends ICommandState> extends CommandBase<T> {
    protected canModify(): boolean;
}
//# sourceMappingURL=row-command-base.d.ts.map