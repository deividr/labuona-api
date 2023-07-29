export type Validation = {
  validate: (values: any) => { ok: boolean; message: string };
};
