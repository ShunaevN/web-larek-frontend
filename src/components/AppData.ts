import {formatNumber} from "../utils/utils";

import {Model} from "./base/Model";
import {FormErrors, IAppState, IItem, IOrder, IContactForm, IOrderForm} from "../types";

export type CatalogChangeEvent = {
    catalog: LotItem[]
};

export class LotItem extends Model<IItem> {
    about: string;
    description: string;
    id: string;
    image: string;
    title: string;
    price: string;
    category: string;

}

export class AppState extends Model<IAppState> {
    basket: HTMLElement[];
    catalog: LotItem[];
    orderList: LotItem[];
    loading: boolean;
    order: IOrder = {
        email: '',
        phone: '',
        items: [],
        payment: '',
        address: '',
        total: 0
    };
    preview: string | null;
    formErrors: FormErrors = {};


    setCatalog(items: IItem[]) {
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setOrderList() {
        this.orderList = [];
        
    }

    setPreview(item: LotItem) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item);
    }


    setOrderField(field: keyof IContactForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    setContactField(field: keyof IOrderForm, value: string) {
        this.order[field] = value;

        if (this.validateOrder()) {
            this.events.emit('order:ready', this.order);
        }
    }

    
    validateOrder() {
        const errors: typeof this.formErrors = {};
        if (!this.order.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        if (!this.order.address){
            errors.address = 'Необходимо указать адрес';
        }
        this.formErrors = errors;
        this.events.emit('formErrors:change', this.formErrors);
        return Object.keys(errors).length === 0;
    }

    getOrderList() {
        return this.orderList;
    }

    
}