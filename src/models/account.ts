export type TypeEnum = 'root' | 'sub';
export type StatusEnum = 'new' | 'active' | 'inactive' | 'blocked';

export class Account {
  static tableName = 'account';

  id!: string;

  created_at!: string;
  updated_at!: string;

  name!: string;
  number!: string;

  type!: TypeEnum;
  status!: StatusEnum;
}
