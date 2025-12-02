import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class ProductsCatalog {
    private products!: IProduct[];
    private selectedProduct!: IProduct | null;
    public eventEmitter: EventEmitter;

    constructor(eventEmitter: EventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    setProducts(products: IProduct[]): void {
        this.products = [...products];
        this.eventEmitter.emit('catalog:set');
    }

    getProducts(): IProduct[] {
        return [...this.products];
    }

    getProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct | null): void {
        this.selectedProduct = product;
    }

    getSelectedProduct(): IProduct | null {
        return this.selectedProduct;
    }
}