export var ProgressIndicationState;
(function (ProgressIndicationState) {
    ProgressIndicationState[ProgressIndicationState["Unknown"] = 0] = "Unknown";
    ProgressIndicationState[ProgressIndicationState["Allowed"] = 1] = "Allowed";
    ProgressIndicationState[ProgressIndicationState["Forbidden"] = 2] = "Forbidden";
})(ProgressIndicationState || (ProgressIndicationState = {}));
export class ProgressIndication {
    constructor(progressService = null) {
        this.progressLimit = 30;
        this.progressRange = 1;
        this.progressService = progressService;
    }
    begin(displayName, minProgress, maxProgress, currentProgress) {
        this.displayName = displayName;
        this.minProgress = minProgress;
        this.progressRange = Math.max(1, maxProgress - minProgress);
        this.normalizedProgress = this.calculateProgress(currentProgress);
        this.indicationTime = new Date();
        this.indicationState = ProgressIndicationState.Unknown;
    }
    setProgress(currentProgress) {
        const progress = this.calculateProgress(currentProgress);
        if (this.indicationState == ProgressIndicationState.Unknown) {
            const now = new Date();
            if (now.valueOf() - this.indicationTime.valueOf() >= ProgressIndication.progressShowDelay.valueOf()) {
                if (progress <= this.progressLimit) {
                    this.indicationState = ProgressIndicationState.Allowed;
                    this.normalizedProgress = progress;
                    this.beginIndicationCore();
                    this.indicateProgressCore();
                    this.indicationTime = now;
                }
                else
                    this.indicationState = ProgressIndicationState.Forbidden;
            }
        }
        if (progress != this.normalizedProgress) {
            this.normalizedProgress = progress;
            if (this.indicationState == ProgressIndicationState.Allowed) {
                const now = new Date();
                if (now.valueOf() - this.indicationTime.valueOf() >= ProgressIndication.minIndicationInterval.valueOf() ||
                    this.normalizedProgress == 100) {
                    this.indicateProgressCore();
                    this.indicationTime = now;
                }
            }
        }
    }
    end() {
        if (this.progressService)
            this.progressService.end();
    }
    calculateProgress(value) {
        return 100 * (value - this.minProgress) / this.progressRange;
    }
    beginIndicationCore() {
        if (this.progressService)
            this.progressService.begin(this.displayName, 0, 100, this.normalizedProgress);
    }
    indicateProgressCore() {
        if (this.progressService)
            this.progressService.setProgress(this.normalizedProgress);
    }
}
ProgressIndication.progressShowDelay = new Date(0, 0, 0, 0, 0, 0, 500);
ProgressIndication.minIndicationInterval = new Date(0, 0, 0, 0, 0, 0, 50);
