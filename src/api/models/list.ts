export interface List<T> {
  totalItems: number;
  results: T[];
  continuationToken: any;
}
