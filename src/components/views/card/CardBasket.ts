import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions} from "./Card";

interface ICardBasket {index: number};

export class CardBasket extends Card<ICardBasket> {
    protected basketCardIndex: HTMLElement;
    protected basketCardDeleteButton: HTMLButtonElement;

    constructor (container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.basketCardIndex = ensureElement<HTMLElement>('.basket__item-index', this.container);
        this.basketCardDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

        if (actions?.onClick) {
            this.basketCardDeleteButton.addEventListener('click', actions.onClick);
        }

    }

    set index(value: number) {
        this.basketCardIndex.textContent = String(value);
    }

}