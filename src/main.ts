import { API_URL } from './utils/constants';
import { Api } from './components/base/Api';
import { Basket } from './components/base/Models/Basket';
import { Products } from './components/base/Models/Products';
import { Customer } from './components/base/Models/Сustomer';
import { WebLarekApi } from './components/base/WebLarekApi';
import { apiProducts } from './utils/data'
import './scss/styles.scss';
const productsModel = new Products(apiProducts.items, null);
const basketModel = new Basket();
const customerModel = new Customer('cash', 'example@yandex.ru', '893333333333', 'Москва, Большая Садовая, 302-бис, пятый этаж, кв. № 50.');

console.log('Массив товаров из каталога: ', productsModel.getItems()); 

basketModel.addItem(productsModel.getItems()[0]);
console.log('Массив товаров из корзины: ', basketModel.getItems());

customerModel.setPayment('cash');
customerModel.setAddress('Москва, Большая Садовая, 302-бис, пятый этаж, кв. № 50.');
customerModel.setPhone('2-36-85');
customerModel.setEmail('example@yandex.ru');
console.log('Данные покупателя:' , customerModel.getData());

const api = new Api(API_URL);
const WebLarekApiModel = new WebLarekApi(api);

WebLarekApiModel.getProducts().then(products => {
  console.log('Каталог товаров c сервера: ', products);
  productsModel.setItems(products);
}).catch(error => {
    console.error("Ошибка при получении товаров с сервера: ", error);
  });

const orderData = {
  ...customerModel.getData(),
  total: basketModel.getTotalItems(),
  items: basketModel.getItems().map(item => item.id)
}

WebLarekApiModel.sendOrder(orderData).then(order => {
  console.log('Заказ отправлен:', order);
}).catch(error => {
  console.log('Ошибка при отправке заказа', error);
});
