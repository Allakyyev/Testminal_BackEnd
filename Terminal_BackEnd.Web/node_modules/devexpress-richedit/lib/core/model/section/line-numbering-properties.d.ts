import { ICloneable, ISupportCopyFrom } from '@devexpress/utils/lib/types';
import { LineNumberingRestartType } from './enums';
export declare class LineNumberDefaults {
    static readonly countBy = 0;
    static readonly start = 1;
    static readonly distance = 360;
    static readonly restart = LineNumberingRestartType.NewPage;
}
export declare class LineNumberingProperties implements ICloneable<LineNumberingProperties>, ISupportCopyFrom<LineNumberingProperties> {
    countBy: number;
    start: number;
    distance: number;
    restart: LineNumberingRestartType;
    constructor(countBy?: number, start?: number, distance?: number, restart?: LineNumberingRestartType);
    get isDefined(): boolean;
    copyFrom(obj: LineNumberingProperties): void;
    clone(): LineNumberingProperties;
    equals(obj: LineNumberingProperties): boolean;
}
//# sourceMappingURL=line-numbering-properties.d.ts.map