import { Position } from './position';
export declare class PositionManager {
    specRunPosition: Position;
    notLoadedPicturePositions: Position[];
    positions: Position[];
    registerSpecRunPosition(position: number): Position;
    unregisterSpecRunPosition(): void;
    registerNotLoadedPicturePosition(position: number): Position;
    registerPosition(position: number): Position;
    private registerPositionCore;
    unregisterPosition(position: Position): void;
    unregisterNotLoadedPicturePosition(position: Position): void;
    private unregisterPositionCore;
    private findPosition;
    reset(): void;
    advance(position: number, delta: number, correction?: number): void;
    private advanceCore;
    private correctPositionIndex;
}
//# sourceMappingURL=position-manager.d.ts.map