import './scss/styles.scss';

import { ItemsAPI } from './components/ItemsAPI';
import {API_URL, CDN_URL, settingsTemplates} from "./utils/constants";
import {EventEmitter} from "./components/base/events";
import {cloneTemplate, createElement, ensureElement} from "./utils/utils";
import { Page } from './components/Page';

import { AppState, CatalogChangeEvent, LotItem } from './components/AppData';
import { CatalogItem } from './components/Card';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { Contact } from './components/Contact';
import { Order } from './components/Order';
import { IContactForm, IOrderForm } from './types';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new ItemsAPI(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const bidsTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const contactTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const modalContainer = ensureElement<HTMLTemplateElement>('#modal-container');

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(modalContainer, events)
const bids = new Basket(cloneTemplate(bidsTemplate), events);
const contact = new Contact(cloneTemplate(contactTemplate), events);
const order = new Order(cloneTemplate(orderTemplate), events);
const success = new Success(cloneTemplate(successTemplate), events);


const a: HTMLElement[] = [];

events.on('card:select', (item: LotItem) => {
    appData.setPreview(item);
});

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
                    events.emit('bids:open', item)
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
        

events.on('modal:open', () => {
    page.locked = true;
});


// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
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
    const card = new CatalogItem(cloneTemplate(cardBasketTemplate), events
    , { onClick: () => events.emit('bids:open', item)}
    );         
                a.push(card.render({
                title: item.title,
                price: item.price,
                index: appData.orderList.length
                    }));
});
    


events.on('bids:open', () => {
    bids.items = a;
    bids.total = appData.orderList.reduce((total, currentValue) => total + Number(
        currentValue.price),
    0,
  );
    modal.render({
        content: 
            bids.render()
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


events.on('success:open', () => {
    appData.order.total = bids.total;
    appData.order.payment = order.payment;
    appData.order.items = appData.getOrderList().map((element) => {
        return element.id
    });
    console.log(appData.order);
    
    api.orderItems(appData.order).
    then(() => {
        a.length = 0;
        appData.orderList = [];
        page.counter = appData.orderList.length;
        success.total = bids.total;
        modal.render({content: success.render({})});
    })
    .catch(err => {
        console.error(err);
    });
});


events.on('order:done', () => {
    modal.close();
});

events.on('formErrors:change', (errors: Partial<IContactForm>) => {
    const { email, phone } = errors;
    contact.valid = !email && !phone;
    contact.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^contacts\..*:change/, (data: { field: keyof IContactForm, value: string }) => {
    appData.setOrderField(data.field, data.value);
});


events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
    const { address } = errors;
    order.valid = !address;
    order.errors = Object.values({address}).filter(i => !!i).join('; ');
});

// Изменилось одно из полей
events.on(/^order\..*:change/, (data: { field: keyof IOrderForm, value: string }) => {
    appData.setContactField(data.field, data.value);
});

events.on('order:delete', (element: HTMLElement ) => {
    appData.orderList.splice(Number(element.textContent) - 1, 1);
    a.length = 0;
    
                for (let i = 0; i < appData.orderList.length; i++){
                const card = new CatalogItem(cloneTemplate(cardBasketTemplate), events);
                a.push(card.render({
                title: appData.orderList[i].title,
                price: appData.orderList[i].price,
                index: i + 1
                    }));
                }
    page.counter = appData.orderList.length;
    events.emit('bids:open');
});



api.getItemList()
    .then(appData.setCatalog.bind(appData))
    .catch(err => {
        console.error(err);
    });