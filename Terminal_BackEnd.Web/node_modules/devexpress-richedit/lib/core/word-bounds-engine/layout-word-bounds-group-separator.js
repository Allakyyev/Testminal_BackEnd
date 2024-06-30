import { Flag } from '@devexpress/utils/lib/class/flag';
import { WordGroupMask } from './layout-word-bounds';
export class LayoutWordBoundsGroupSeparator {
    constructor() {
        this.isAnyGroupSet = false;
    }
    applyMask(mask) {
        if (!this.isAnyGroupSet) {
            this.isAnyGroupSet = true;
            this.whileNoOneGroupSet(mask);
            return false;
        }
        if (mask == this.ignoredGroupMask)
            return false;
        this.ignoredGroupMask = WordGroupMask.NoOne;
        if (this.mask.get(WordGroupMask.DiffersFromAll))
            return true;
        this.mask.set(mask, true);
        if (this.prevMask && this.prevMask.getValue() != this.mask.getValue())
            return true;
        this.prevMask = this.mask.clone();
        return false;
    }
}
export class LayoutWordBoundsNextGroupSeparator extends LayoutWordBoundsGroupSeparator {
    constructor(isJoinSpacesOnEndWord) {
        super();
        this.initGroup = isJoinSpacesOnEndWord ? WordGroupMask.Space : WordGroupMask.NoOne;
    }
    whileNoOneGroupSet(mask) {
        if (mask == WordGroupMask.DiffersFromAll) {
            this.mask = new Flag(mask);
            return;
        }
        this.ignoredGroupMask = mask;
        this.prevMask = new Flag(this.initGroup);
        this.mask = new Flag(this.initGroup);
    }
}
export class LayoutWordBoundsPrevGroupSeparator extends LayoutWordBoundsGroupSeparator {
    whileNoOneGroupSet(mask) {
        if (mask == WordGroupMask.Space) {
            this.ignoredGroupMask = WordGroupMask.Space;
            this.mask = new Flag(WordGroupMask.NoOne);
            this.prevMask = null;
        }
        else {
            this.mask = new Flag(mask);
            this.prevMask = this.mask.clone();
        }
    }
}
