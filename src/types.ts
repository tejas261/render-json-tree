export type JsonData = {
    [key: string]:
      | string
      | number
      | boolean
      | JsonData
      | (string | number)[]
      | JsonData[];
  };
  
  export interface EditableJsonTreeProps {
    data: JsonData;
    width?: string;
    viewStyle?: string;
    backgroundColor?: string;
    keyTextColor?: string;
    valueTextColor?: string;
    fontSize?: string;
    fontStyle?: string;
  }