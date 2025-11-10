import { IBuyer, TPayment } from "../../types";

export class Buyer {
    private payment: TPayment = '';
    private address: string = '';
    private phone: string = '';
    private email: string = '';

    setData(buyer: Partial<IBuyer>): void {
        if (buyer.payment !== undefined) this.payment = buyer.payment;
        if (buyer.address !== undefined) this.address = buyer.address;
        if (buyer.phone !== undefined) this.phone = buyer.phone;
        if (buyer.email !== undefined) this.email = buyer.email;
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
        this. email = '';
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