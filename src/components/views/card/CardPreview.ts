import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";
import { CDN_URL } from "../../../utils/constants";
import { categoryMap } from "../../../utils/constants";

export type TCardPreview = Pick<IProduct, 'image' | 'category' | 'description'>;
type CategoryKey = keyof typeof categoryMap;

export class CardPreview extends Card<TCardPreview & { buttonText: string, buttonState: boolean }> {
    protected cardCategory: HTMLElement;
    protected cardImage: HTMLImageElement;
    protected cardDescription: HTMLElement;
    protected cardButton: HTMLButtonElement;


    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
        this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
        this.cardDescription = ensureElement<HTMLElement>('.card__text', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('.card__button', this.container);

        this.cardButton.addEventListener('click', () => {
            this.events.emit('cardPreview:action');
        })
    }
    
    set buttonText(value: string) {
        this.cardButton.innerHTML = value;
    }

    set buttonState(value: boolean) {
        this.cardButton.disabled = !value;
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

    set description(value: string) {
        this.cardDescription.textContent = value;
    }
}