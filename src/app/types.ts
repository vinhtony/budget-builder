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