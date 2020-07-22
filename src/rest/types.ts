export interface SearchRequest<Template> {
  template: Template;
  listSortConfiguration?: Array<ColumnSortConfiguration>;
}

export interface ColumnSortConfiguration {
  columnName: string;
  sortOrder: string;
}

export type Option<Value = any> = {
  name: string;
  value: Value;
}