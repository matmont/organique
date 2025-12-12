export interface IEntrezDbInfo {
  name: string;
  printName: string;
  descirption: string;
  build: string;
  count: number;
  lastUpdate: Date;
  fields: {
    name: string;
    fullName: string;
    description: string;
    count: number;
    isDate: boolean;
    isNumerical: boolean;
    singleToken: boolean;
    hierarchy: boolean;
    isHidden: boolean;
  }[];
  links: {
    name: string;
    printName: string;
    description: string;
    db: string;
  }[];
}
