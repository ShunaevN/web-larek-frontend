import {Form} from "./common/Form";
import {IContactForm} from "../types";
import {IEvents} from "./base/Events";


export class ContactForm extends Form<IContactForm> {
    protected _button: HTMLElement;
    protected _phone: HTMLInputElement
    protected _email: HTMLInputElement
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._button = this.container.querySelector('.button');
        this._phone = this.container.elements.namedItem('phone') as HTMLInputElement;
        this._email = this.container.elements.namedItem('email') as HTMLInputElement;
        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('success:open');
            })
        }
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    set email(value: string) {
        this._email.value = value;
    }
}