export class ShapeUtils {
    static shouldSwapSize(rtfAngle) {
        let angle = rtfAngle % (360 * 65536);
        if (angle < 0)
            angle += 360 * 65536;
        return ((angle >= 45 * 65536 && angle < 135 * 65536) || (angle >= 225 * 65536 && angle < 315 * 65536));
    }
}
ShapeUtils.distanceFromText = 114305;
