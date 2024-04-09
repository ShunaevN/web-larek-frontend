import { LotItem } from "../components/AppData";

declare const DEVELOPMENT: boolean;
declare const API_ORIGIN: string;

export interface IItem {
	id: string;
    description: string;
    image: string;
	title: string;
	category: string;
    price: number;
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


export interface IAppState {
    gallery: IItem[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
export type previewItem = Omit<IItem, 'description'>; // Тип для отображения товара на главной
export type basketPreviewItem = Pick<IItem, 'title'|'price'>; // Тип для отображения товара в корзине