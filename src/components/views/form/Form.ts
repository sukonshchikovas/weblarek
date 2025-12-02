import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
    errors: string;
    buttonState: boolean;
}

export class Form<T extends IForm> extends Component<T> {
    protected formErrors: HTMLElement;
    protected formButton: HTMLButtonElement;

    constructor (protected events: IEvents, container: HTMLElement) {
        super(container);

        this.formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
        this.formButton = ensureElement<HTMLButtonElement>('.modal__actions .button', this.container);

    }

    set errors(value: string) {
        this.formErrors.textContent = value;
    }

    set buttonState(value: boolean) {
        this.formButton.disabled = !value;
    }

}