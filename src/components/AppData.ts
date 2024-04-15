import { Model } from "./base/Model";
import { FormErrors, IAppState, IItem, IOrder, IContactForm, IOrderForm } from "../types";
import { mailRegex, phoneRegex } from "../utils/constants";
import { IEvents } from "./base/Events";

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

    constructor(data: Partial<IAppState>, events: IEvents) {
        super(data, events);
        this.setBasket();
        this.setOrderList();
    }

    setCatalog(items: IItem[]) {
        this.catalog = items.map(item => new LotItem(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setOrderList() {
        this.orderList = [];
    }

    setBasket() {
        this.basket = [];
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
        if (!this.order.email.match(mailRegex)) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.order.phone.match(phoneRegex)) {
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