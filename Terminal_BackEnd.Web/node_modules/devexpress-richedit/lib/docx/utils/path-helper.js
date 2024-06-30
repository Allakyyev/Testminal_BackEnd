import { StringUtils } from '@devexpress/utils/lib/utils/string';
export class PathHelper {
    static getDir(filePath) {
        const index = filePath.lastIndexOf('/');
        return index == -1 ? '' : filePath.substring(0, index);
    }
    static getFileName(filePath) {
        const index = filePath.lastIndexOf('/');
        return index == -1 ? filePath : filePath.substr(index + 1);
    }
    static getFileExtension(filePath) {
        const index = filePath.lastIndexOf('.');
        return filePath.substr(index + 1);
    }
    static normalize(filePath) {
        return StringUtils.startsAt(filePath, '/') ? filePath.substr(1) : filePath;
    }
}
