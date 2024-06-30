import { BaseManipulator } from '../base-manipulator';
import { AnchorInfoManipulator } from './anchor-info-manipulator';
import { ImageManipulator } from './image-manipulator';
import { ShapeManipulator } from './shape-manipulator';
import { AnchorPictureSizeManipulator, AnchorTextBoxSizeManipulator } from './size-manipulator';
import { TextBoxPropertiesManipulator } from './text-box-properties-manipulator';
import { ZOrderManipulator } from './z-order-manipulator';
export class FloatingObjectsManipulator extends BaseManipulator {
    constructor(manipulator) {
        super(manipulator);
        this.anchorInfo = new AnchorInfoManipulator(manipulator);
        this.shape = new ShapeManipulator(manipulator);
        this.textBoxSize = new AnchorTextBoxSizeManipulator(manipulator);
        this.pictureSize = new AnchorPictureSizeManipulator(manipulator);
        this.textBoxProperties = new TextBoxPropertiesManipulator(manipulator);
        this.zOrder = new ZOrderManipulator(manipulator);
        this.image = new ImageManipulator(manipulator);
    }
}
