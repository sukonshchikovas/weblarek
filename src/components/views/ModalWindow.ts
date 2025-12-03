import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class ModalWindow extends Component<IModal> {
    protected modalContent: HTMLElement;
    protected modalCloseButton: HTMLButtonElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
        this.modalCloseButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container) {
                this.events.emit('modal:close', this.container);
            }
        });

        this.modalCloseButton.addEventListener('click', () => {
            this.events.emit('modal:close');
        })
    }

    open() {
        this.container.classList.add('modal_active');
    }

    close() {
        this.container.classList.remove('modal_active');
    }

    set content(content: HTMLElement) {
        this.modalContent.replaceChildren(content);
    }
}