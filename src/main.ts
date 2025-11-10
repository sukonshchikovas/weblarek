import './scss/styles.scss';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ShopApi } from './components/models/ShopApi';

import { IBuyer, IApi } from './types';
import { ProductsCatalog } from './components/models/ProductCatalog';
import { Cart } from './components/models/Cart';
import { Buyer } from './components/models/Buyer';

const productsCatalog = new ProductsCatalog();
productsCatalog.setProducts(apiProducts.items);

console.log('Массив товаров из каталога: ', productsCatalog.getProducts());
console.log('Товар, найденный по идентификатору: ', productsCatalog.getProductById(apiProducts.items[2].id));
productsCatalog.setSelectedProduct(apiProducts.items[1]);
console.log('Выбранный товар для подробного отображения: ', productsCatalog.getSelectedProduct());


const shoppingCart = new Cart();
shoppingCart.addProduct(apiProducts.items[0]);
shoppingCart.addProduct(apiProducts.items[1]);
shoppingCart.addProduct(apiProducts.items[2]);
console.log('Массив товаров в корзине: ', shoppingCart.getProducts());
console.log('Полная стоимость всех товаров в корзине: ', shoppingCart.getTotalPrice());
console.log('Количество всех товаров в корзине: ', shoppingCart.getProductsCount());

shoppingCart.hasProductById(apiProducts.items[3].id) ? 
    console.log('Товар с таким id есть в корзине') : 
    console.log('Товар с таким id отсутствует в корзине');

shoppingCart.deleteProduct(apiProducts.items[0].id);
console.log('Массив товаров в корзине после удаления: ', shoppingCart.getProducts());
shoppingCart.clear();
console.log('Очищенный массив товаров в коризне: ', shoppingCart.getProducts());


const buyerModel = new Buyer();
const buyer: IBuyer = {
    payment: 'cash',
    address: 'Moscow',
    phone: '+79998887766',
    email: 'aaa@ru'
}
buyerModel.setData(buyer);
console.log('Данные покупателя: ', buyerModel.getData());
buyer.payment = '';
buyerModel.setData(buyer);
console.log('Измененные данные покупателя: ', buyerModel.getData());

const errors = buyerModel.validate();
if (errors.isValid)
    console.log('Все поля заполнены');
else {
    Object.entries(errors.errors).forEach(([field, message]) => {
            if (message) {
                console.log('Найдены ошибки: ', message);
            }
        })
}


const api: IApi = new Api(API_URL);
const shopApi = new ShopApi(api);

shopApi.getProducts()
    .then(products => {
        productsCatalog.setProducts(products);
        console.log('Массив товаров из каталога: ', productsCatalog.getProducts())
    })
    .catch(error => {
        console.log('Ошибка при получении товаров: ', error)
    });

