import { IBuyer, TPayment } from "../../types";
import { EventEmitter } from "../base/Events";

export class Buyer {
    private payment: TPayment = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';
    public eventEmmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmmitter = eventEmitter;
    }

    setData(buyer: Partial<IBuyer>): void {
        if (buyer.payment !== undefined) this.payment = buyer.payment;
        if (buyer.address !== undefined) this.address = buyer.address;
        if (buyer.phone !== undefined) this.phone = buyer.phone;
        if (buyer.email !== undefined) this.email = buyer.email;

        this.eventEmmitter.emit('buyer:change');
    }

    getData(): IBuyer {
        return {
            payment: this.payment,
            address: this.address,
            phone: this.phone,
            email: this.email,
        };
    }

    clear(): void {
        this.payment = '';
        this.address = '';
        this.phone = '';
        this.email = '';

        this.eventEmmitter.emit('buyer:change');
    }

    validate(): { isValid: boolean; errors: { [K in keyof IBuyer]?: string } } {
        const errors: { [K in keyof IBuyer]?: string } = {};
        let isValid = true;

        if (!this.payment) {
            errors.payment = 'Необходимо выбрать способ оплаты';
            isValid = false;
        }

        if (!this.address) {
            errors.address = 'Необходимо указать адрес';
            isValid = false;
        }

        if (!this.phone) {
            errors.phone = 'Необходимо указать номер';
            isValid = false;
        }
        
        if (!this.email) {
            errors.email = 'Необходимо указать email';
            isValid = false;
        }

        return { isValid, errors };
  }
}