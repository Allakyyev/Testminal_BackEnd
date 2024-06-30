import { FloatingObjectHorizontalPositionTypeApi, FloatingObjectVerticalPositionTypeApi } from './image-enums';
export class HorizontalAlignedPositionApi {
    constructor(relativeTo, alignment) {
        this.type = FloatingObjectHorizontalPositionTypeApi.Aligned;
        this.relativeTo = relativeTo;
        this.alignment = alignment;
    }
}
export class HorizontalAbsolutePositionApi {
    constructor(relativeTo, position) {
        this.type = FloatingObjectHorizontalPositionTypeApi.Absolute;
        this.relativeTo = relativeTo;
        this.position = position;
    }
}
export class HorizontalRelativePositionApi {
    constructor(relativeTo, relativePosition) {
        this.type = FloatingObjectHorizontalPositionTypeApi.Relative;
        this.relativeTo = relativeTo;
        this.relativePosition = relativePosition;
    }
}
export class VerticalAlignedPositionApi {
    constructor(relativeTo, alignment) {
        this.type = FloatingObjectVerticalPositionTypeApi.Aligned;
        this.relativeTo = relativeTo;
        this.alignment = alignment;
    }
}
export class VerticalAbsolutePositionApi {
    constructor(relativeTo, position) {
        this.type = FloatingObjectVerticalPositionTypeApi.Absolute;
        this.relativeTo = relativeTo;
        this.position = position;
    }
}
export class VerticalRelativePositionApi {
    constructor(relativeTo, relativePosition) {
        this.type = FloatingObjectVerticalPositionTypeApi.Relative;
        this.relativeTo = relativeTo;
        this.relativePosition = relativePosition;
    }
}
