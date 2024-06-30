import { RtfFieldInfo } from '../../model/fields/rtf-field-info';
import { DestinationType } from '../utils/destination-type';
import { FieldSubDestination } from './field-sub-destination';
export declare class CodeFieldDestination extends FieldSubDestination {
    protected get destinationType(): DestinationType;
    get currentInfo(): RtfFieldInfo;
    protected createInstance(): FieldSubDestination;
    protected processTextCore(text: string): void;
    protected processCharCore(ch: string): void;
    onDestinationClose(): void;
    private getCurrentFieldType;
}
//# sourceMappingURL=code-field-destination.d.ts.map