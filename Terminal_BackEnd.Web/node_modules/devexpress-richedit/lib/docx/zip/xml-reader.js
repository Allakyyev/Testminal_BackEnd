import { Stack } from '@devexpress/utils/lib/class/stack';
import { StringUtils } from '@devexpress/utils/lib/utils/string';
import { ContentType } from '../utils/constants';
export var XmlReaderState;
(function (XmlReaderState) {
    XmlReaderState[XmlReaderState["Ok"] = 0] = "Ok";
    XmlReaderState[XmlReaderState["Error"] = 1] = "Error";
    XmlReaderState[XmlReaderState["EndOfFile"] = 2] = "EndOfFile";
})(XmlReaderState || (XmlReaderState = {}));
export var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType[XmlNodeType["None"] = 0] = "None";
    XmlNodeType[XmlNodeType["Element"] = 1] = "Element";
    XmlNodeType[XmlNodeType["EndElement"] = 2] = "EndElement";
    XmlNodeType[XmlNodeType["Text"] = 3] = "Text";
    XmlNodeType[XmlNodeType["CDATA"] = 4] = "CDATA";
    XmlNodeType[XmlNodeType["SignificantWhitespace"] = 5] = "SignificantWhitespace";
    XmlNodeType[XmlNodeType["Whitespace"] = 6] = "Whitespace";
    XmlNodeType[XmlNodeType["Comment"] = 7] = "Comment";
})(XmlNodeType || (XmlNodeType = {}));
var ElementStages;
(function (ElementStages) {
    ElementStages[ElementStages["ElementStart"] = 0] = "ElementStart";
    ElementStages[ElementStages["ChildElements"] = 1] = "ChildElements";
    ElementStages[ElementStages["ElementEnd"] = 2] = "ElementEnd";
    ElementStages[ElementStages["ToNextNode"] = 3] = "ToNextNode";
})(ElementStages || (ElementStages = {}));
class ElementInfo {
    constructor(node, nodeType) {
        this.elementStage = ElementStages.ElementStart;
        this.node = node;
        this.nodeType = nodeType;
    }
    get localName() { return this.node.localName; }
    get name() { return this.node.nodeName; }
    get namespaceURI() { return this.node.namespaceURI; }
}
export class XmlReader {
    constructor(str, options, filePath) {
        str = StringUtils.trimStart(str);
        this.filePath = filePath;
        this.document = new DOMParser().parseFromString(str, ContentType.xml);
        this.state = XmlReaderState.Ok;
        this.elementStack = new Stack();
        this.elementStack.push(new ElementInfo(this.document.firstChild, XmlNodeType.None));
        this.handleNewNode(this.document.firstChild);
        this.options = options;
    }
    get elementInfo() { return this.elementStack.last; }
    get nodeType() { return this.elementInfo.nodeType; }
    get localName() { return this.elementInfo.localName; }
    get name() { return this.elementInfo.name; }
    get namespaceURI() { return this.elementInfo.namespaceURI; }
    get attributes() { return this.elementInfo.node.attributes; }
    get value() { return this.elementInfo.node.nodeValue; }
    getAttribute(name) {
        return this.elementInfo.node.getAttribute(name);
    }
    getAttributeNS(name, namespaceUri) {
        return this.elementInfo.node.getAttributeNS(namespaceUri, name);
    }
    skipElement() {
        this.elementInfo.elementStage = ElementStages.ToNextNode;
    }
    readToFollowingNS(name, ns) {
        do {
            if (this.nodeType == XmlNodeType.Element && this.localName == name && this.namespaceURI == ns)
                return true;
        } while (this.read());
        return false;
    }
    readToFollowing(name) {
        do {
            if (this.nodeType == XmlNodeType.Element && this.localName == name && this.handleNewNode(this.elementInfo.node))
                return true;
        } while (this.read());
        return false;
    }
    read() {
        const info = this.elementInfo;
        if (!info)
            return false;
        switch (info.elementStage) {
            case ElementStages.ElementStart: {
                info.elementStage++;
                switch (info.node.nodeType) {
                    case Node.COMMENT_NODE:
                        info.nodeType = XmlNodeType.Comment;
                        if (this.options.ignoreComments) {
                            this.elementInfo.elementStage = ElementStages.ToNextNode;
                            return this.read();
                        }
                        this.elementInfo.elementStage = ElementStages.ToNextNode;
                        break;
                    case Node.TEXT_NODE:
                        info.nodeType = XmlNodeType.Text;
                        info.elementStage = ElementStages.ToNextNode;
                        break;
                    default:
                        info.nodeType = XmlNodeType.Element;
                        break;
                }
                if (info.node.nodeName == '#cdata-section') {
                    info.nodeType = XmlNodeType.CDATA;
                    this.elementInfo.elementStage = ElementStages.ToNextNode;
                }
                break;
            }
            case ElementStages.ChildElements: {
                info.elementStage++;
                const child = this.elementInfo.node.firstChild;
                if (child) {
                    if (!this.handleNewNode(child))
                        return false;
                    this.elementStack.push(new ElementInfo(child, XmlNodeType.None));
                }
                return this.read();
            }
            case ElementStages.ElementEnd: {
                info.elementStage++;
                info.nodeType = XmlNodeType.EndElement;
                break;
            }
            case ElementStages.ToNextNode: {
                const nextNode = info.node.nextSibling;
                if (nextNode) {
                    this.elementStack.pop();
                    if (!this.handleNewNode(nextNode))
                        return false;
                    this.elementStack.push(new ElementInfo(nextNode, XmlNodeType.None));
                }
                else {
                    this.elementStack.pop();
                    if (!this.elementStack.count) {
                        this.state = XmlReaderState.EndOfFile;
                        return false;
                    }
                }
                return this.read();
            }
        }
        return true;
    }
    handleNewNode(node) {
        if (node.nodeName == 'parsererror') {
            this.state = XmlReaderState.Error;
            return false;
        }
        return true;
    }
}
