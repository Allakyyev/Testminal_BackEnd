import { Browser } from '@devexpress/utils/lib/browser';
import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
import { isDefined } from '@devexpress/utils/lib/utils/common';
export function SetStyles(element, styles, makeImportant) {
    if (isDefined(styles.cssText))
        element.style.cssText = styles.cssText;
    if (isDefined(styles.className))
        element.className = styles.className;
    for (var property in styles) {
        if (!Object.prototype.hasOwnProperty.call(styles, property))
            continue;
        var value = styles[property];
        switch (property) {
            case "cssText":
            case "className":
                break;
            case "float":
                SetElementFloat(element, value);
                break;
            case "opacity":
                element.style.opacity = value.toString();
                break;
            case "zIndex":
                SetStylesCore(element, property, value, makeImportant);
                break;
            default:
                SetStylesCore(element, property, value + (typeof (value) == "number" ? "px" : ""), makeImportant);
        }
    }
}
;
function SetElementFloat(element, value) {
    if (isDefined(element.style.cssFloat))
        element.style.cssFloat = value;
    else if (isDefined(element.style.styleFloat))
        element.style.styleFloat = value;
    else
        AttrUtils.setElementAttribute(element, "float", value);
}
;
function SetStylesCore(element, property, value, makeImportant) {
    if (makeImportant) {
        const index = property.search("[A-Z]");
        if (index != -1)
            property = property.replace(property.charAt(index), "-" + property.charAt(index).toLowerCase());
        element.style.setProperty(property, value, "important");
    }
    else
        element.style[property] = value;
}
export function IsExistsElement(element) {
    return element && IsValidElement(element);
}
export function IsValidElement(element) {
    if (!element)
        return false;
    if (!(Browser.Firefox && Browser.Version < 4)) {
        if (element.ownerDocument && element.ownerDocument.body && element.ownerDocument.body.compareDocumentPosition)
            return element.ownerDocument.body.compareDocumentPosition(element) % 2 === 0;
    }
    if (!Browser.Opera && !(Browser.IE && Browser.Version < 9) && element.offsetParent && element.parentNode.tagName)
        return true;
    while (element != null) {
        if (element.tagName == "BODY")
            return true;
        element = element.parentNode;
    }
    return false;
}
export function IsPercentageSize(size) {
    return size && size.indexOf('%') != -1;
}
