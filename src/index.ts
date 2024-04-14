import './scss/styles.scss';

import { ItemsAPI } from './components/ItemsAPI';
import {API_URL, CDN_URL, settingsTemplates} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {cloneTemplate, ensureElement} from "./utils/utils";
import { Page } from './components/Page';

import { AppState, LotItem } from './components/AppData';
import { CatalogItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Contact } from './components/Contact';
import { Order } from './components/Order';
import { IContactForm, IOrderForm, CatalogChangeEvent} from './types';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ItemsAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.cardCatalogTemplate);
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.cardPreviewTemplate);
const basketTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.basketTemplate);
const cardBasketTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.cardBasketTemplate);
const contactTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.contactsTemplate);
const orderTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.orderTemplate);
const successTemplate = ensureElement<HTMLTemplateElement>(settingsTemplates.successTemplate);
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events)
const basket = new Basket(cloneTemplate(basketTemplate), events);
const contact = new Contact(cloneTemplate(contactTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);

api.getItemList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });

appData.setBasket();
appData.setOrderList();

events.on('preview:changed', (item: LotItem) => {
        const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), events, {
            onClick: () => {
                if (card.buttonText === 'Купить') {
                appData.orderList.push(item);
                card.buttonText = "В корзину";
                page.counter = appData.getOrderList().length
                events.emit('buy:item', item)
                }
                else {
                    events.emit('basket:open', item)
                }
            } 
        });
        modal.render({
            content: card.render({
                title: item.title,
                category: item.category,
                image: item.image,
                description: item.description,
                price: item.price
                })
            })
});
        
events.on('card:select', (item: LotItem) => {
    appData.setPreview(item);
});

events.on<CatalogChangeEvent>('items:changed', () => {
    page.gallery = appData.catalog.map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), events, {
            onClick: () => events.emit('card:select', item)
        });

        return card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            category: item.category,
            price: item.price
        });
    });  
});

events.on('buy:item', (item: LotItem) => {
    const card = new CatalogItem(cloneTemplate(cardBasketTemplate),
     events, { onClick: () => events.emit('basket:open', item)});         
                appData.basket.push(card.render({
                title: item.title,
                price: item.price,
                index: appData.orderList.length
                    }));
});
    
events.on('basket:open', () => {
    basket.items = appData.basket;
    basket.total = appData.orderList.reduce((total, currentValue) => total + Number(
        currentValue.price), 0,);
    modal.render({
        content: 
        basket.render()
    });
    
});

events.on('contacts:open', () => {
    modal.render({
        content: contact.render({
            phone: '',
            email: '',
            valid: false,
            errors: []
        })
    });
});


events.on('order:open', () => {
    modal.render({
        content: order.render({
            address: '',
            valid: false,
            errors: []
        })
    });
});

events.on('order:delete', (element: HTMLElement ) => {
    appData.orderList.splice(Number(element.textContent) - 1, 1);
    appData.basket.length = 0;
                for (let i = 0; i < appData.orderList.length; i++){
                const card = new CatalogItem(cloneTemplate(cardBasketTemplate), events);
                appData.basket.push(card.render({
                title: appData.orderList[i].title,
                price: appData.orderList[i].price,
                index: i + 1
                    }));
                }
    page.counter = appData.orderList.length;
    events.emit('basket:open');
});

events.on('order:done', () => {
    modal.close();
});

events.on('success:open', () => {
    appData.order.total = basket.total;
    appData.order.payment = order.payment;
    appData.order.items = appData.getOrderList().map((element) => {
        return element.id
    });
    api.orderItems(appData.order).
    then(() => {
        appData.basket.length = 0;
        appData.orderList = [];
        page.counter = appData.orderList.length;
        success.total = basket.total;
        modal.render({content: success.render({})});
    })
    .catch(err => {
        console.error(err);
    });
});

events.on('formErrors:change', (errors: Partial<IContactForm>) => {
    const { email, phone } = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { address } = errors;
    order.valid = !address;
    order.errors = Object.values({address}).filter(i => !!i).join('; ');
});

events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setContactField(data.field, data.value);
});


events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});