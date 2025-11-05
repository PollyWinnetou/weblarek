import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Basket } from './components/base/Models/Basket';
import { Products } from './components/base/Models/Products';
import { Header } from './components/base/View/Header';
import { Customer } from './components/base/Models/Сustomer';
import { WebLarekApi } from './components/base/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/base/View/Gallery';
import { ensureElement, cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/base/View/Card/CardCatalog';
import { CardBasket } from './components/base/View/Card/CardBasket';
import { IProduct } from './types';
import { Modal } from './components/base/View/Modal';
import { CardPreview } from './components/base/View/Card/CardPreview';
import { BasketView } from './components/base/View/BasketView';
import './scss/styles.scss';
import { Order } from './components/base/View/Form/Order';
//base
const api = new Api(API_URL);
const WebLarekApiModel = new WebLarekApi(api);
const events = new EventEmitter();
//Models
const products = new Products([], null, events);
const basket = new Basket(events);
const customer = new Customer();
//View
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement("#modal-container"), events);
const header = new Header(ensureElement('.header'), events);
const basketView = new BasketView(ensureElement(cloneTemplate("#basket")), events);


WebLarekApiModel.getProducts().then((result: IProduct[]) => {
  console.log('Каталог товаров c сервера: ', result);
  products.setItems(result);
}).catch(error => {
  console.error("Ошибка при получении товаров с сервера: ", error);
})

events.on('catalog:change', () => {
  const items = products.getItems().map((item) => {
      const cardCatalog = new CardCatalog(cloneTemplate("#card-catalog"), {
        onClick: () => {
          products.setSelectedItem(item);
        }
      });
      return cardCatalog.render(item);
  })
  gallery.setItems(items);
})

events.on('card:select', () => {
  const selectedProduct = products.getSelectedItem();
  const cardPreview = new CardPreview(cloneTemplate("#card-preview"), events);
  const cardInBasket = basket.hasItem(selectedProduct.id);

	let buttonText;
	if (selectedProduct.price) {
		buttonText = cardInBasket ? 'Удалить из корзины' : 'Купить';
	} else {
		buttonText = 'Недоступно';
	}
	modal.content = cardPreview.render({
		...selectedProduct,
		buttonText
	});
  modal.openModal();
})

//кнопка добавить в корзину или удалить из корзины
events.on('product:button-click', () => {
  const selectedProduct = products.getSelectedItem();
  if (selectedProduct) {
    const inBasket = basket.hasItem(selectedProduct.id);
    if (inBasket) {
      basket.deleteItem(selectedProduct.id);
      modal.closeModal();
    } else {
      basket.addItem(selectedProduct);
      modal.closeModal();
    }
  }
})

events.on('product:change', () => {
  header.сounter = basket.getCountItems();  
  const items = basket.getItems().map((item, index) => { 
    const cardBasket = new CardBasket(cloneTemplate("#card-basket"), events);
    return cardBasket.render({
      ...item,
      index: index + 1,
   });
  });
  const priceTotal = basket.getTotalItems();
  basketView.render({ listProducts: items, totalPrice: priceTotal });
});

//открытие модалки с корзиной
events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.openModal();  
});

/*events.on('basket:delete', () => {
  const productInBasket = basket.getItems();
  basket.deleteItem(productInBasket.id);
})*/

//кнопка оформить отрисовывается форма заказа
events.on('basket:create', () => {
  const order = new Order(cloneTemplate("#order"), events);
  modal.content = order.render();
  modal.openModal();
})





/*WebLarekApiModel.sendOrder(orderData).then(order => {
  console.log('Заказ отправлен:', order);
}).catch(error => {
  console.log('Ошибка при отправке заказа', error);
});*/