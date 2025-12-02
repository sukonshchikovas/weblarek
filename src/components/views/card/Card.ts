import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IProduct } from "../../../types";


export type TCard = Pick<IProduct, 'title' | 'price'>;
export interface ICardActions {
    onClick?: (event: MouseEvent) => void;
}

export class Card<T> extends Component<TCard & T> {
    protected cardTitle: HTMLElement;
    protected cardPrice: HTMLElement;

    constructor (container: HTMLElement) {
        super(container);

        this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
        this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);

    }

    set title(value: string) {
        this.cardTitle.textContent = value;
    }

    set price(value: string) {
        if (value === null)
            this.cardPrice.textContent = 'Бесценно'
        else this.cardPrice.textContent = `${value} синапсов`;
    }
}