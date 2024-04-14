import { LotItem } from "../components/AppData";

export interface IItem {
	id: string;
    description: string;
    image: string;
	title: string;
	category: string;
    price: number;
}

export interface ISuccess {
    total: number;
}

export interface IModalData {
    content: HTMLElement;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IContactForm {
    email: string;
    phone: string;
}

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IOrder extends IContactForm {
    payment: string;
    address: string;
	items: string[];
    total: number;
}

export interface IOrderSuccess extends IOrder {
    id: string;
    total: number;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
}


export interface IAppState {
    gallery: IItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    description?: string | string[];
    image: string;
    category: string;
    price?: string;
    index?: number;
}

export interface IPage {
    counter: number;
    gallery: HTMLElement[];
    locked: boolean;
}

export interface IItemsAPI {
    getItemList: () => Promise<IItem[]>;
    getItem: (id: string) => Promise<IItem>;
    orderItems: (order: IOrder) => Promise<IOrderSuccess>;
}



export type CatalogChangeEvent = {
    catalog: LotItem[]
};

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';