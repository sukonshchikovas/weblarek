import { IApi, IOrderRequest, IOrderResponse, IProduct, IProductResponce } from "./../types";

export class ShopApi {
    constructor(private api: IApi) {}

    async getProducts(): Promise<IProduct[]> {
        const response: IProductResponce = await this.api.get<IProductResponce>('/product');
        return response.items;
    }

    async postOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
        const response: IOrderResponse = await this.api.post<IOrderResponse>('/order', orderData);
        return response;
    }
}