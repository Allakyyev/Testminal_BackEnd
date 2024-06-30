import { DocumentModel } from '../core/model/document-model';
import { RangeCopy } from '../core/model/manipulators/range/create-range-copy-operation';
import { SubDocument } from '../core/model/sub-document';
import { FixedInterval } from '@devexpress/utils/lib/intervals/fixed';
import { IRichEditControl } from './interfaces/i-rich-edit-core';
export declare class HtmlBuilder {
    _getHtmlString(): string;
    private _currentElement;
    childElements: Array<Element | string>;
    callbacks: Array<(target: HtmlBuilder) => void>;
    isEmpty(): boolean;
    clear(): this;
    startChild(tagName: string, namespaceUri?: string): this;
    configure<T extends Element = HTMLElement>(config: (element: T) => void): this;
    addCallback(callback: (target: HtmlBuilder) => void): void;
    assignFrom(builder: HtmlBuilder | string): this;
    addElement(element: Element | string): this;
    endChild(tagName: string): this;
}
export declare class HtmlExporter {
    control: IRichEditControl;
    rangeCopy: RangeCopy;
    private get colorProvider();
    constructor(control: IRichEditControl);
    getHtmlElementsByInterval(model: DocumentModel, subDocument: SubDocument, interval: FixedInterval, guidLabel: string): HtmlBuilder;
    private getHtmlText;
    private getBorderCssString;
    private getTableWidthUnitCssString;
    private getTableStyle;
    private getCellStyle;
    private getTextBoxStyleString;
}
//# sourceMappingURL=html-export.d.ts.map