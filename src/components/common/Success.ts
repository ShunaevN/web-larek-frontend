import { Component } from "../base/Component";
import { formatNumber } from "../../utils/utils";
import { EventEmitter } from "../base/events";
import { ISuccess } from "../../types";


export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, events: EventEmitter) {
        super(container);
        
        this._close = this.container.querySelector('.order-success__close');
        this._total = this.container.querySelector('.order-success__description');

        if (this._close) {
            this._close.addEventListener('click', () => {
                events.emit('order:done');
                
            });
        }
    }

    setText(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = "Списано " + String(value) + " синапсов";
        }
    }

    set total(value: number){
        this.setText(this._total,formatNumber(value));
    }
}