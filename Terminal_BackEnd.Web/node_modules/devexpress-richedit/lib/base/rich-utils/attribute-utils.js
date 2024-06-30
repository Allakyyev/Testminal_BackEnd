import { AttrUtils } from '@devexpress/utils/lib/utils/attr';
export class AttributeUtils {
    static changeElementStyleAttribute(obj, attrName, newValue) {
        AttrUtils.saveStyleAttributeInElement(obj, attrName);
        AttributeUtils.setStyleAttribute(obj.style, attrName, newValue);
    }
    static setStyleAttribute(obj, attrName, newValue) {
        if (obj.setAttribute)
            AttrUtils.setElementAttribute(obj, attrName, newValue);
        else
            AttrUtils.setStyleAttribute(obj, attrName, newValue);
    }
}
