import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class Basket {
    private products: IProduct[] = [];
    public eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    addProduct(product: IProduct): void {
        this.products.push(product);
       
        this.eventEmitter.emit('basket:change')
    }
    

    deleteProduct(id: string): void {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
        
        this.eventEmitter.emit('basket:change')
    }

    clear():void {
        this.products = [];
        
        this.eventEmitter.emit('basket:change')
    }

    getTotalPrice(): number {
        return this.products.reduce((total, product) => {
            return total + (product.price || 0); // если цена null, считаем как 0
        }, 0);
    }

    getProductsCount(): number {
        return this.products.length;
    }

    hasProductById(id: string): boolean {
        return this.products.some(product => product.id === id);
    }
}