import { ensureElement } from "../../../utils/utils";
import { categoryMap } from "../../../utils/constants";
import { Card, ICardActions} from "./Card";
import { IProduct } from "../../../types";
import { CDN_URL } from "../../../utils/constants";

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, 'image' | 'category'>;

export class CardCatalog extends Card<TCardCatalog> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;

    constructor (container: HTMLElement, actions?: ICardActions) {
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);

        if (actions?.onClick) {
            this.container.addEventListener('click', actions.onClick);
        }

    }

    set category(value: string) {
        this.cardCategory.textContent = value;

        for (const key in categoryMap) {
            this.cardCategory.classList.toggle(
                categoryMap[key as CategoryKey], 
                key === value);
        }
    }

    set image(value: string) {
        const imageSrc = `${CDN_URL}/${value}`;
        this.setImage(this.cardImage, imageSrc, this.title);
    }
}