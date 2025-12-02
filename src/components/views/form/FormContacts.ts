import { ensureElement } from "../../../utils/utils";
import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";

interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IContactsForm> {
    protected inputEmail: HTMLInputElement;
    protected inputPhone: HTMLInputElement;


    constructor (protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.inputEmail = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
        this.inputPhone = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);

     
        this.container.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit('order:pay');
        });

        this.inputEmail.addEventListener('input', () => {
            this.events.emit('email:change', {email: this.inputEmail.value});
        })

        this.inputPhone.addEventListener('input', () => {
            this.events.emit('phone:change', {phone: this.inputPhone.value});
        })
    }

    set email(value: string) {
        this.inputEmail.value = value;
    }

    set phone(value: string) {
        this.inputPhone.value = value;
    }

}