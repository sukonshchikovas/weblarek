import './scss/styles.scss';

import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { ShopApi } from './components/ShopApi';
import { IProduct, IBuyer, IApi, IOrderRequest, IOrderResponse } from './types';
import { EventEmitter} from './components/base/Events';
import { cloneTemplate, ensureElement } from './utils/utils';

import { ProductsCatalog } from './components/models/ProductsCatalog';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Gallery } from './components/views/Gallery';
import { Header } from './components/views/Header';
import { ModalWindow } from './components/views/ModalWindow';
import { BasketItem } from './components/views/BasketItem';
import { OrderSuccess } from './components/views/OrderSuccess';

import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview } from './components/views/card/CardPreview';
import { CardBasket } from './components/views/card/CardBasket';

import { FormContacts } from './components/views/form/FormContacts';
import { FormOrder } from './components/views/form/FormOrder';

const eventEmitter = new EventEmitter();
const productsCatalog = new ProductsCatalog(eventEmitter);
const basketShop = new Basket(eventEmitter);
const buyer = new Buyer(eventEmitter);

const api: IApi = new Api(API_URL);
const shopApi = new ShopApi(api);

const headerElement = ensureElement<HTMLElement>('.header');
const header = new Header(eventEmitter, headerElement);

const gallery = new Gallery(ensureElement<HTMLElement>('.page__wrapper'));
const modal = new ModalWindow(eventEmitter, ensureElement<HTMLElement>('#modal-container'));

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderSuccessWindow = new OrderSuccess(eventEmitter, cloneTemplate(orderSuccessTemplate));
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basket = new BasketItem(eventEmitter, cloneTemplate(basketTemplate));

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const formOrderTemplate = ensureElement<HTMLTemplateElement>('#order');
const formContactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const orderFormWindow = new FormOrder(eventEmitter, cloneTemplate(formOrderTemplate));
const contactsFormWindow = new FormContacts(eventEmitter, cloneTemplate(formContactsTemplate));


eventEmitter.on('catalog:set', () => {
    const itemCards = productsCatalog.getProducts().map((item) => {
        const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
            onClick: () => eventEmitter.emit('card:select', item),
        });
        return card.render(item);
    });

    gallery.render({catalog: itemCards});
})

// Рендер предпросмотра карточки
function renderCardPreview(item: IProduct): HTMLElement {
    const inBasket = basketShop.hasProductById(item.id);
    const { buttonText, buttonState } = getCardButtonState(item, inBasket);

    return new CardPreview(eventEmitter, cloneTemplate(cardPreviewTemplate))
        .render({ ...item, buttonText, buttonState });
}

// Определение состояния и текста кнопки карточки
function getCardButtonState(item: IProduct, inBasket: boolean) {
    if (item.price === null) {
        return { buttonText: 'Недоступно', buttonState: false };
    }
    if (inBasket) {
        return { buttonText: 'Удалить из корзины', buttonState: true };
    }
    return { buttonText: 'Добавить', buttonState: true };
}

eventEmitter.on('card:select', (item: IProduct) => {
    productsCatalog.setSelectedProduct(item);
    modal.render({ content: renderCardPreview(item) })
        .classList.add('modal_active');
});

eventEmitter.on('cardPreview:action', () => {
    const product = productsCatalog.getSelectedProduct();
    if (!product) return;

    const inBasket = basketShop.hasProductById(product.id);
    inBasket 
        ? basketShop.deleteProduct(product.id) 
        : basketShop.addProduct(product);

        
    modal.render().classList.remove('modal_active');
});

function renderBasket(): HTMLElement {
    const itemCards = basketShop.getProducts().map((item, index) => {
        const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
            onClick: () => eventEmitter.emit('card:removeFromBasket', item),
        });
        return card.render({...item, index: index + 1});
    });

    const totalPrice = basketShop.getTotalPrice();

    return basket.render({
        basketList: itemCards, 
        price: totalPrice,
        buttonState: totalPrice > 0
    });

}

eventEmitter.on('basket:open', () => {
    modal.render({content: renderBasket()}).classList.add('modal_active');
})

eventEmitter.on('basket:change', () => {
    const productsCount = basketShop.getProductsCount();
    header.render({counter: productsCount});
})

eventEmitter.on('card:removeFromBasket', (item: IProduct) => {
    if (basketShop.hasProductById(item.id)) {
        basketShop.deleteProduct(item.id);
        renderBasket()
    }
})

eventEmitter.on('modal:close', () => {
    modal.render().classList.remove('modal_active');
})

eventEmitter.on('basket:order', () => {
    const orderData = buyer.getData();
    const orderContent = orderFormWindow.render({address: orderData.address, paymentMethod: orderData.payment});
    modal.render({content: orderContent}).classList.add('modal_active');
})

eventEmitter.on('buyer:change', () => {
    const errors = buyer.validate().errors;

    const orderErrors = [errors.payment, errors.address].filter(Boolean).join('; ');
    const contactsErrors = [errors.email, errors.phone].filter(Boolean).join('; ');

    orderFormWindow.render({
        errors: orderErrors,
        buttonState: !orderErrors,
        paymentMethod: buyer.getData().payment
    });

    contactsFormWindow.render({
        errors: contactsErrors,
        buttonState: !contactsErrors
    });
})

eventEmitter.on('payment:card', () => {
    buyer.setData({ payment: 'card' });
})

eventEmitter.on('payment:cash', () => {
    buyer.setData({ payment: 'cash' });
})

eventEmitter.on('address:change', (addressBuyer: Pick<IBuyer, 'address'>) => {
    buyer.setData({address: addressBuyer.address});
})

eventEmitter.on('email:change', (emailBuyer: Pick<IBuyer, 'email'>) => {
    buyer.setData({email: emailBuyer.email});
})

eventEmitter.on('phone:change', (phoneBuyer: Pick<IBuyer, 'phone'>) => {
    buyer.setData({phone: phoneBuyer.phone});
})

eventEmitter.on('order:proceedToContacts', () => {
    const buyerData = buyer.getData();
    const contactsContent = contactsFormWindow.render({
        email: buyerData.email,
        phone: buyerData.phone
    });
    modal.render({content: contactsContent}).classList.add('modal_active');
})

eventEmitter.on('order:pay', () => {
 
    makeOrder()
        .then(response => { 
            
            const orderSuccessContent = orderSuccessWindow.render({description: basketShop.getTotalPrice()});
            modal.render({content: orderSuccessContent}).classList.add('modal_active');
            
            basketShop.clear();
            buyer.clear();
        })
        .catch(error => {
            console.error('Ошибка при отправке заказа:', error);
        });
});

function makeOrder(): Promise<IOrderResponse> { 
    const buyerData = buyer.getData();
    const itemIds: string[] = basketShop.getProducts().map(product => product.id);
    const orderData: IOrderRequest = {
        payment: buyerData.payment,
        email: buyerData.email,
        phone: buyerData.phone,
        address: buyerData.address,
        total: basketShop.getTotalPrice(),
        items: itemIds
    }

    return shopApi.postOrder(orderData);
}

eventEmitter.on('orderSuccess:close', () => {
    modal.render().classList.remove('modal_active');
})

shopApi.getProducts()
    .then(products => {
        productsCatalog.setProducts(products);
    })
    .catch(error => {
        console.log('Ошибка при получении товаров: ', error)
    });

