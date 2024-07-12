export interface Category {
  id: string;
  label: string;
  subCategories: Category[];
  data: Data[];
}

export interface Data {
  id: string;
  value: number;
  monthId: string;
}

export interface ContextValue {
  groupKey: 'income' | 'expenses',
  index: number,
  subIndex: number,
  value: number
}