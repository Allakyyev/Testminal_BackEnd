import { PrintingSettings, PrintMode } from '../../../core/model/options/printing';
import { CommandBase, CommandSimpleOptions } from '../command-base';
import { SimpleCommandState } from '../command-states';
import { IRichEditControl } from '../../interfaces/i-rich-edit-core';
export declare class PrintDocumentOnClient extends CommandBase<SimpleCommandState> {
    private readonly _nonce;
    isEnabled(): boolean;
    isEnabledInReadOnlyMode(): boolean;
    constructor(control: IRichEditControl, _nonce: string);
    getState(): SimpleCommandState;
    private getMode;
    private getclosePrintDialogWithHtmlPreview;
    executeCore(_state: SimpleCommandState, options: CommandSimpleOptions<PrintMode | PrintingSettings | undefined>): boolean;
    private printCore;
    private generatePrintDocument;
    private generatePrintContent;
    private createZIndexStyles;
}
//# sourceMappingURL=print-document-on-client-command.d.ts.map