import {Form} from "./common/Form";
import {IContactForm} from "../types";
import {IEvents} from "./base/events";


export class Contact extends Form<IContactForm> {
    protected _button: HTMLElement;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._button = this.container.querySelector('.button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('success:open');
            })
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}