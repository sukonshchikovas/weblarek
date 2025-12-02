import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketItem {
    basketList: HTMLElement[];
    price: number;
    buttonState: boolean;
}

export class BasketItem extends Component<IBasketItem> {
    protected basketListCards: HTMLUListElement;
    protected basketButton: HTMLButtonElement;
    protected basketPrice: HTMLElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.basketListCards = ensureElement<HTMLUListElement>('.basket__list', this.container);
        this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

        this.basketButton.addEventListener('click', () => {
            this.events.emit('basket:order');
        })

    }

    set basketList(items: HTMLElement[]) {
        this.basketListCards.replaceChildren(...items);
    }

    set price(value: number) {
        this.basketPrice.textContent = `${value} синапсов`;
    }

    set buttonState(value: boolean) {
        this.basketButton.disabled = !value;
    }
}