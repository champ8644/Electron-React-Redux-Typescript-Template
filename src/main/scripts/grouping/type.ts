export type Book = Array<Record<string, unknown>>;

export interface RecursiveObject<T> {
  [k: string]: RecursiveObject<T> | T;
}

export type GroupCount = RecursiveObject<Book | number>;

export type GroupSchema = RecursiveObject<Array<number>>;

export type GroupLeaf = {
  __leaf__: true;
  member: Book;
  schema: GroupSchema;
  groupMap: Array<number>;
  key: string;
};

export type GroupTemplate = RecursiveObject<GroupLeaf>;

export type GroupList = Record<string, Array<number>>;

export type FinalGroup = Array<Array<Record<string, unknown>>>;
