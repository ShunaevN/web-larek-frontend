import { Component } from "./base/Component";
import { ensureElement } from "../utils/utils";
import { settingsCategory } from "../utils/constants";
import { EventEmitter } from "./base/Events";
import { ICard, ICardActions } from "../types";


export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _description?: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _category?: HTMLElement; 
    protected _price?: HTMLElement;
    protected _indexElement?: HTMLElement;
    protected _deleteButton?: HTMLElement;

    constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
        this._image = container.querySelector(`.${blockName}__image`);
        this._button = container.querySelector(`.${blockName}__button`);
        this._description = container.querySelector(`.${blockName}__text`);
        this._category = container.querySelector(`.${blockName}__category`);
        this._price = container.querySelector(`.${blockName}__price`);
        this._indexElement = this.container.querySelector('.basket__item-index');

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set category(value: string) {
        this.setText(this._category, value);
    }  

    set price(value: string) {
        this.setText(this._price, value);
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set buttonText(value: string) {
        this.setText(this._button, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title)
    }

    setIndexElement() {
        this.setText(this._indexElement, String(Number(this._indexElement.textContent) + 1))
    }

    set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }

    get buttonText(){
        return this._button.textContent;
    }

    get button(){
        return this._button;
    }
}


export class CatalogItem extends Card {
    protected _status: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter, actions?: ICardActions) {
        super('card', container, actions);
        this._indexElement = this.container.querySelector('.basket__item-index');
        this._deleteButton = this.container.querySelector('.basket__item-delete');
        if(this._deleteButton){
            this._deleteButton.addEventListener('click', () => {
                events.emit('order:delete', this._indexElement );
            })
        } 
    }
 
    render(data?: Partial<ICard>): HTMLElement {
        Object.assign(this as object, data ?? {});
    if (data.price) {
        this.price = data.price + " синапсов";
    }
    else {
        this.price = 'Бесценно';
    }
    if (data.category) {
        this.toggleClass(this._category, settingsCategory[data.category as keyof typeof settingsCategory], true);
    }
    if (data.index) {
        this.setText(this._indexElement, data.index)
    }

    return this.container;

    }
  
}










