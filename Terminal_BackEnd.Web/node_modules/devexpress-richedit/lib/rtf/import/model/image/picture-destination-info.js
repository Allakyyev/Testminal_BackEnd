import { PictureSourceType } from '../../destination/utils/enums';
import { Win32MapMode } from '../enums';
import { RtfShapePropertiesInfo } from '../shape/shape-properties-info';
export class PictureDestinationInfo {
    constructor() {
        this.pictureSourceType = PictureSourceType.WindowsBmp;
        this.wmfMapMode = Win32MapMode.Text;
        this.bmpBitsPerPixel = 1;
        this.bmpColorPlanes = 1;
        this.pictureWidth = -1;
        this.pictureHeight = -1;
        this.desiredPictureWidth = -1;
        this.desiredPictureHeight = -1;
        this.scaleX = 100;
        this.scaleY = 100;
        this.imageUri = "";
        this.leftCrop = 0;
        this.topCrop = 0;
        this.rightCrop = 0;
        this.bottomCrop = 0;
        this.dataStream = [];
        this.properties = new RtfShapePropertiesInfo();
    }
    get dataCrc32() { return 0; }
}
