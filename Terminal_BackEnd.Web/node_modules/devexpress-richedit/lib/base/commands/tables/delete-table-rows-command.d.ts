import { ICommandOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { RowCommandBase } from './row-command-base';
export declare class DeleteTableRowsCommand extends RowCommandBase<SimpleCommandState> {
    getState(): SimpleCommandState;
    isEnabled(): boolean;
    executeCore(_state: SimpleCommandState, options: ICommandOptions): boolean;
}
//# sourceMappingURL=delete-table-rows-command.d.ts.map