import { IProduct } from "../../types";

export class Cart {
    private products: IProduct[] = [];

    getProducts(): IProduct[] {
        return [...this.products];
    }

    addProduct(product: IProduct): void {
        this.products.push(product);
    }

    deleteProduct(id: string): void {
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
        }
    }

    clear():void {
        this.products = [];
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