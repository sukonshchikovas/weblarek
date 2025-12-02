import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
    description: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected orderDescription: HTMLElement;
    protected orderSuccessButton: HTMLButtonElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.orderDescription = ensureElement<HTMLElement>('.order-success__description', this.container);
        this.orderSuccessButton = ensureElement<HTMLButtonElement>('.order-success__close', this.container);

        this.orderSuccessButton.addEventListener('click', () => {
            this.events.emit('orderSuccess:close');
        })
    }

    set description(value: number) {
        this.orderDescription.textContent = `Списано ${value} синапсов`;
    }
}