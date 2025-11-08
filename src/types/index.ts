export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
  }
  
export interface IBuyer {
    payment: 'cash' | 'card' | '';
    email: string;
    phone: string;
    address: string;
  }

export interface IOrder extends IBuyer {
    total: number;
    items: string[];
}

export interface IGallery {
  items: HTMLElement;
}

export interface IHeader {
  counter: number;
}

export interface IModal {
  content: HTMLElement;
}

export interface ISuccess {
  sum: number;
}

export interface IBasketView {
  listProducts: HTMLElement[];
  totalPrice: number;
}

export interface ICardActions {
  onClick: (event: MouseEvent) => void
}

export interface IForm extends IBuyer {
  errors: string;
  valid: boolean;
}