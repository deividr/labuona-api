export class Unauthourized extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "Unauthorized";
  }
}

export class AlreadyExists extends Error {
  constructor(description: string) {
    super(description);
    this.name = description;
  }
}
