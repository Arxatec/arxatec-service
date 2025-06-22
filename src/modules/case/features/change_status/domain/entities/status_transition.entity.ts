export class StatusTransition {
  constructor(
    public readonly currentId: number,
    public readonly nextId: number
  ) {}

  isAdjacent(): boolean {
    return this.nextId === this.currentId + 1 ||
           this.nextId === this.currentId - 1;
  }
}
