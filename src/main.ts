import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Basket } from './components/Models/Basket';
import { Products } from './components/Models/Products';
import { Header } from './components/View/Header'; 
import { Customer } from './components/Models/Сustomer';
import { WebLarekApi } from './components/base/WebLarekApi';
import { EventEmitter } from './components/base/Events';
import { Gallery } from './components/View/Gallery'; 
import { ensureElement, cloneTemplate } from './utils/utils';
import { CardCatalog } from './components/View/Card/CardCatalog'; 
import { CardBasket } from './components/View/Card/CardBasket'; 
import { IBuyer, IProduct } from './types';
import { Modal } from './components/View/Modal';
import { CardPreview } from './components/View/Card/CardPreview'; 
import { BasketView } from './components/View/BasketView'; 
import { Order } from './components/View/Form/Order'; 
import { Contacts } from './components/View/Form/Contacts'; 
import { Success } from './components/View/Success';
import './scss/styles.scss';
//base
const api = new Api(API_URL);
const WebLarekApiModel = new WebLarekApi(api);
const events = new EventEmitter();
//Models
const products = new Products([], null, events);
const basket = new Basket(events);
const customer = new Customer(events);
//View
const gallery = new Gallery(ensureElement('.gallery'));
const modal = new Modal(ensureElement("#modal-container"), events);
const header = new Header(ensureElement('.header'), events);
const basketView = new BasketView(ensureElement(cloneTemplate("#basket")), events);
const order = new Order(cloneTemplate("#order"), events);
const contacts = new Contacts(cloneTemplate("#contacts"), events);
const success = new Success(cloneTemplate("#success"), events);
const cardPreview = new CardPreview(cloneTemplate("#card-preview"), events);


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
  if (selectedProduct) {
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
 }
})

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
  const isEmpty = basket.getItems().length === 0;
  basketView.render({ listProducts: items, totalPrice: priceTotal });

  basketView.valid = !isEmpty;
});

events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.openModal();
});

events.on('basket:delete', ({id}: {id: string}) => {
  basket.deleteItem(id);
})

events.on('basket:create', () => {
  modal.content = order.render();
})

events.on('form:change', (event: {field: keyof IBuyer, value: string}) => {
  const { field, value } = event;
  switch(field) {
    case 'payment':
      customer.setPayment(value as "cash" | "card" | "");
      break;
    case 'address':
      customer.setAddress(value);
      break;
    case 'email':
      customer.setEmail(value);
      break;
    case 'phone':
      customer.setPhone(value);
      break;
  }
})

events.on('order:change', () => {  
  const validation = customer.validateForm();
  const { payment, address } = validation;  
  const isValid = !(payment || address);
  const formData = {
    payment: customer.getData().payment,
    address: customer.getData().address,
    valid: isValid, 
    errors: validation.value
  };
  order.render(formData);
});

events.on('order:submit', () => {
  modal.content = contacts.render();
  modal.openModal();
})

events.on('contact:change', () => {  
  const validation = customer.validateForm();
  const { email, phone } = validation;  
  const isValid = !(email || phone);
  const formData = {
    email: customer.getData().email,
    phone: customer.getData().phone,
    valid: isValid, 
    errors: validation.value
  };
  contacts.render(formData);
});

events.on('contacts:submit', () => {
  const orderData = {
    payment: customer.getData().payment,
    address: customer.getData().address,
    email: customer.getData().email,
    phone: customer.getData().phone,
    total: basket.getTotalItems(),
    items: basket.getItems().map(item => item.id)
  }

  WebLarekApiModel.sendOrder(orderData).then(order => {
    console.log('Заказ отправлен:', order);

    success.sum = basket.getTotalItems();
    modal.content = success.render({ sum: basket.getTotalItems() });
    basket.clearItems();
    customer.clearData();

  }).catch(error => {
    console.log('Ошибка при отправке заказа', error);
  });
})

events.on('done:click', () => {
  modal.closeModal();
})