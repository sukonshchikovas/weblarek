import { ensureElement } from "../../../utils/utils";
import { Form, IForm} from "./Form";
import { IEvents } from "../../base/Events";
import { TPayment } from "../../../types";


interface IOrderForm extends IForm {
    address: string;
    paymentMethod: TPayment;
}

export class FormOrder extends Form<IOrderForm> {
    protected inputAddress: HTMLInputElement;
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;


    constructor (protected events: IEvents, container: HTMLElement) {
        super(events, container);

        this.inputAddress = ensureElement<HTMLInputElement>('input[name="address"]', this.container);
        this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.container);
        this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.container);


        this.container.addEventListener('submit', (event) => {
            event.preventDefault();
            
            this.events.emit('order:proceedToContacts');
        });

        this.cardButton.addEventListener('click', () => {
            this.events.emit('payment:card');
        })

        this.cashButton.addEventListener('click', () => {
            this.events.emit('payment:cash');
        })

        this.inputAddress.addEventListener('input', () => {
            this.events.emit('address:change', {address: this.inputAddress.value});
        })

    }

    set address(value: string) {
        this.inputAddress.value = value;
    }

    set paymentMethod(value: TPayment) {
        this.cardButton.classList.toggle('button_alt-active', value === 'card');
        this.cashButton.classList.toggle('button_alt-active', value === 'cash');
    }

}