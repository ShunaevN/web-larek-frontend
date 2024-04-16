import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/Events";


export class Order extends Form<IOrderForm> {
  protected _buttonCard: HTMLElement;
  protected _buttonCash: HTMLElement;
  protected _button: HTMLElement;
  protected _payment: string;
  protected _address: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonCard = this.container.querySelector('.button_card');
        this._buttonCash = this.container.querySelector('.button_cash');
        this._button = this.container.querySelector('.order__button');
        this.toggleCard(true);
        this._address = this.container.elements.namedItem('address')  as HTMLInputElement;
        this._payment = this._buttonCard.textContent;

        if (this._buttonCard) {
          this._buttonCard.addEventListener('click', () => {
            this.toggleCard(true);
            this.toggleCash(false);
            this._payment = this._buttonCard.textContent;
          })
        }

        if (this._buttonCash) {
          this._buttonCash.addEventListener('click', () => {
            this.toggleCard(false);
            this.toggleCash(true);
            this._payment = this._buttonCash.textContent;
          })
        }

        if (this._button) {
          this._button.addEventListener('click', () => {
              events.emit('contacts:open');
          })
      }
    }

    set address(value: string) {
        this._address.value = value;
    }

    get payment() {
      return this._payment;
    }

    toggleCard(state: boolean = true) {
      this.toggleClass(this._buttonCard, 'button_alt-active', state);
  }

     toggleCash(state: boolean = true) {
      this.toggleClass(this._buttonCash, 'button_alt-active', state);
  }  
}