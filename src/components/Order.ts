import {Form} from "./common/Form";
import {IOrderForm} from "../types";
import {IEvents} from "./base/events";


export class Order extends Form<IOrderForm> {
  protected _buttonCard: HTMLElement;
  protected _buttonCash: HTMLElement;
  protected _button: HTMLElement;
  protected _payment: string;
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._buttonCard = this.container.querySelector('.button_card');
        this._buttonCash = this.container.querySelector('.button_cash');
        this._button = this.container.querySelector('.order__button');
        this._buttonCard.classList.add('button_alt-active');
        this._payment = this._buttonCard.textContent;

        if (this._buttonCard) {
          this._buttonCard.addEventListener('click', () => {
            this._buttonCard.classList.add('button_alt-active');
            this._buttonCash.classList.remove('button_alt-active');
            this._payment = this._buttonCard.textContent;
          })
        }

        if (this._buttonCash) {
          this._buttonCash.addEventListener('click', () => {
            this._buttonCash.classList.add('button_alt-active');
            this._buttonCard.classList.remove('button_alt-active');
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
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    get payment()
    {
      return this._payment;}

}