import { Log } from '../../core/rich-utils/debug/logger/base-logger/log';
import { Browser } from '@devexpress/utils/lib/browser';
import { Errors } from '@devexpress/utils/lib/errors';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ContentType, DocxNsType } from '../utils/constants';
export class XmlWriter {
    constructor(constants) {
        this.rootNamespaces = [];
        this.constants = constants;
    }
    initNS(rootElementName, rootElementNamespace) {
        this.dom = document.implementation.createDocument(rootElementNamespace, rootElementName, null);
        this.curr = this.dom.documentElement;
        return this;
    }
    convertToString() {
        const result = new XMLSerializer().serializeToString(this.dom.documentElement);
        if (Browser.IE) {
            const additionalMarkup = [];
            const firstTagXml = result.match(/\<.*?\>/)[0];
            for (const nsInfo of this.rootNamespaces) {
                const nsXmlDescription = `xmlns:${nsInfo.prefix}="${nsInfo.namespace}"`;
                if (firstTagXml.search(nsXmlDescription) == -1)
                    additionalMarkup.push(nsXmlDescription);
            }
            return result
                .replace(/xmlns.*?\".*?\"/, `$& ${additionalMarkup.join(' ')} `)
                .replace('xmlns:xml="http://www.w3.org/XML/1998/namespace"', '');
        }
        return result;
    }
    addNamespaceToRootElement(type) {
        const nsInfo = this.constants.namespaces[type];
        this.rootNamespaces.push(nsInfo);
        this.dom.documentElement.setAttributeNS('http://www.w3.org/2000/xmlns/', `xmlns${StringUtils.isNullOrEmpty(nsInfo.prefix) ? '' : `:${nsInfo.prefix}`}`, nsInfo.namespace);
    }
    elementStart(name) {
        this.curr = this.curr.appendChild(this.dom.createElementNS(this.curr.namespaceURI, this.prefixPlusLocalName(this.constants.mapNamespaceToPrefix[this.curr.namespaceURI], name)));
        return this;
    }
    elementStartNS(docxType, localName) {
        const nsInfo = this.constants.namespaces[docxType];
        this.curr = this.curr.appendChild(this.dom.createElementNS(nsInfo.namespace, this.prefixPlusLocalName(nsInfo.prefix, localName)));
        return this;
    }
    endElement() {
        this.curr = this.curr.parentNode;
        return this;
    }
    attr(attrName, value) {
        this.curr.setAttribute(attrName, value);
        return this;
    }
    attrNS(docxType, attrName, value) {
        const nsInfo = this.constants.namespaces[docxType];
        this.curr.setAttributeNS(nsInfo.namespace, this.prefixPlusLocalName(nsInfo.prefix, attrName), value);
        return this;
    }
    writeString(text) {
        this.curr.appendChild(this.dom.createTextNode(text));
        return this;
    }
    writeRaw(str) {
        const nodeList = new DOMParser().parseFromString(str, ContentType.xml).documentElement.childNodes;
        for (let ind = nodeList.length; ind > 0; ind--)
            this.curr.appendChild(nodeList[0]);
    }
    writeWpEmptyElement(tag) {
        this.writeWpStartElement(tag);
        this.endElement();
    }
    writeWpStartElement(tag) {
        this.elementStartNS(DocxNsType.WordProcessing, tag);
    }
    writeWpsStartElement(tag) {
        this.elementStartNS(DocxNsType.Wps, tag);
    }
    writeWpDrawingStartElement(name) {
        this.elementStartNS(DocxNsType.WordProcessingDrawing, name);
    }
    writeDrawingStartElement(name) {
        this.elementStartNS(DocxNsType.DrawingML, name);
    }
    writeWp14DrawingStartElement(name) {
        this.elementStartNS(DocxNsType.WordProcessingDrawing14, name);
    }
    writeMcStartElement(name) {
        this.elementStartNS(DocxNsType.MC, name);
    }
    writePicDrawingStartElement(name) {
        this.elementStartNS(DocxNsType.DrawingMLPicture, name);
    }
    writeWpStringValue(tag, value) {
        this.writeWpStartElement(tag);
        this.attrNS(DocxNsType.WordProcessing, 'val', value);
        this.endElement();
    }
    writeWpBoolValue(tag, value) {
        this.writeWpStringValue(tag, this.convertBoolToString(value));
    }
    writeWpBoolValueAsTag(tag, value) {
        if (value) {
            this.writeWpStartElement(tag);
            this.endElement();
        }
    }
    writeWpIntValue(tag, value) {
        this.writeWpStringValue(tag, value.toString());
    }
    writeWpStringAttr(attrName, value) {
        const nsInfo = this.constants.namespaces[DocxNsType.WordProcessing];
        this.curr.setAttributeNS(nsInfo.namespace, this.prefixPlusLocalName(nsInfo.prefix, attrName), value);
    }
    writeWpBoolAttr(attr, value) {
        this.writeWpStringAttr(attr, this.convertBoolToString(value));
    }
    writeWpIntAttr(attr, value) {
        this.writeWpStringAttr(attr, value.toString());
    }
    writeDCEmptyElement(tag) {
        this.elementStartNS(DocxNsType.DC, tag);
        this.endElement();
    }
    writeCPEmptyElement(tag) {
        this.elementStartNS(DocxNsType.CP, tag);
        this.endElement();
    }
    writeBoolValue(tag, value) {
        this.attr(tag, this.convertBoolToString(value));
    }
    writeIntValue(tag, value) {
        const intValue = Math.floor(value);
        if (Log.isDebug && intValue !== value)
            throw new Error(Errors.InternalException);
        this.attr(tag, intValue.toString());
    }
    writeWpEmptyOrFalseValue(tag, value) {
        if (value)
            this.writeWpEmptyElement(tag);
        else
            this.writeWpBoolValue(tag, false);
    }
    prefixPlusLocalName(prefix, localName) {
        return StringUtils.isNullOrEmpty(prefix) ? localName : `${prefix}:${localName}`;
    }
    convertBoolToString(value) {
        return value ? '1' : '0';
    }
}
