type TypeEnum = 'root' | 'sub';
type StatusEnum = 'new' | 'active' | 'inactive' | 'blocked';

export class Account {
  id!: string;

  created_at!: string;
  updated_at!: string;

  name!: string;
  number!: string;

  type!: TypeEnum;
  status!: StatusEnum;
}
