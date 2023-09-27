export class Unauthourized extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "Unauthorized";
  }
}
