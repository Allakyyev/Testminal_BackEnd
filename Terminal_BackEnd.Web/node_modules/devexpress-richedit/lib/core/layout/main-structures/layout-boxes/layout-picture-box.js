import { LayoutBox, LayoutBoxType } from './layout-box';
export class LayoutPictureBox extends LayoutBox {
    constructor(characterProperties, colorInfo, cacheInfo, size) {
        super(characterProperties, colorInfo);
        this.cacheInfo = cacheInfo;
        this.width = size.width;
        this.height = size.height;
        this.isLoaded = this.cacheInfo.isLoaded;
    }
    equals(obj) {
        return super.equals(obj) && this.cacheInfo.equals(obj.cacheInfo) && this.isLoaded == obj.isLoaded;
    }
    clone() {
        const newObj = new LayoutPictureBox(this.characterProperties, this.colorInfo, this.cacheInfo, this.createSize());
        newObj.copyFrom(this);
        return newObj;
    }
    getType() {
        return LayoutBoxType.Picture;
    }
    pushInfoForMeasure(_info, _showHiddenSymbols) { }
    popInfoForMeasure(_info, _showHiddenSymbols) { }
    getAscent() {
        return this.height;
    }
    getDescent() {
        return 0;
    }
    isVisible() {
        return true;
    }
    isVisibleForRowAlign() {
        return true;
    }
    renderGetContent(renderer) {
        return renderer.renderPictureBoxContent(this.createSize(), this.cacheInfo, this.hyperlinkTip);
    }
    isWhitespace() {
        return false;
    }
    isLineBreak() {
        return false;
    }
}
