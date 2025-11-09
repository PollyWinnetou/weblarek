// Базовые утилиты и API
import { API_URL } from "./utils/constants";
import { Api } from "./components/base/Api";
import { WebLarekApi } from "./components/WebLarekApi";
import { EventEmitter } from "./components/base/Events";
// Модели данных
import { Basket } from "./components/Models/Basket";
import { Products } from "./components/Models/Products";
import { Customer } from "./components/Models/Сustomer";
// Представления (View)
import { Header } from "./components/View/Header";
import { Gallery } from "./components/View/Gallery";
import { Modal } from "./components/View/Modal";
import { BasketView } from "./components/View/BasketView";
// Компоненты карточек
import { CardCatalog } from "./components/View/Card/CardCatalog";
import { CardBasket } from "./components/View/Card/CardBasket";
import { CardPreview } from "./components/View/Card/CardPreview";
// Формы
import { Order } from "./components/View/Form/Order";
import { Contacts } from "./components/View/Form/Contacts";
import { Success } from "./components/View/Success";
// Утилиты и типы
import { IBuyer, IProduct } from "./types";
import { ensureElement, cloneTemplate } from "./utils/utils";
import "./scss/styles.scss";
// base
const api = new Api(API_URL);
const webLarekApiModel = new WebLarekApi(api);
const events = new EventEmitter();
// Models
const products = new Products([], null, events);
const basket = new Basket(events);
const customer = new Customer(events);
// View
const gallery = new Gallery(ensureElement(".gallery"));
const modal = new Modal(ensureElement("#modal-container"), events);
const header = new Header(ensureElement(".header"), events);
const basketView = new BasketView(ensureElement(cloneTemplate("#basket")),events);
const order = new Order(cloneTemplate("#order"), events);
const contacts = new Contacts(cloneTemplate("#contacts"), events);
const success = new Success(cloneTemplate("#success"), events);
const cardPreview = new CardPreview(cloneTemplate("#card-preview"), events);

webLarekApiModel.getProducts()
  .then((result: IProduct[]) => {
    products.setItems(result);
  })
  .catch(error => console.log(error));

events.on("catalog:change", () => {
  const items = products.getItems().map((item) => {
    const cardCatalog = new CardCatalog(cloneTemplate("#card-catalog"), {
      onClick: () => {
        products.setSelectedItem(item);
      },
    });
    return cardCatalog.render(item);
  });
  gallery.setItems(items);
});

events.on("card:select", () => {
  const selectedProduct = products.getSelectedItem();
  if (selectedProduct) {
    const cardInBasket = basket.hasItem(selectedProduct.id);

    let buttonText;
    if (selectedProduct.price) {
      buttonText = cardInBasket ? "Удалить из корзины" : "Купить";
    } else {
      buttonText = "Недоступно";
    }
    modal.content = cardPreview.render({
      ...selectedProduct,
      buttonText,
    });
    modal.openModal();
  }
});

events.on("product:button-click", () => {
  const selectedProduct = products.getSelectedItem();
  if (selectedProduct) {
    const inBasket = basket.hasItem(selectedProduct.id);
    if (inBasket) {
      basket.deleteItem(selectedProduct.id);
    } else {
      basket.addItem(selectedProduct);
    }
    modal.closeModal();
  }
});

events.on("basket:change", () => {
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

events.on("basket:open", () => {
  modal.content = basketView.render();
  modal.openModal();
});

events.on("basket:delete", ({ id }: { id: string }) => {
  basket.deleteItem(id);
});

events.on("order:open", () => {
  modal.content = order.render();
});

events.on("form:change", (event: { field: keyof IBuyer; value: string }) => {
  const { field, value } = event;
  switch (field) {
    case "payment":
      customer.setPayment(value as "cash" | "card" | "");
      break;
    case "address":
      customer.setAddress(value);
      break;
    case "email":
      customer.setEmail(value);
      break;
    case "phone":
      customer.setPhone(value);
      break;
  }
});

events.on("order:change", () => {
  const validation = customer.validateForm();
  const customerData = customer.getData();
  const { payment, address } = validation;
  const isValid = !(payment || address);
  const formData = {
    payment: customerData.payment,
    address: customerData.address,
    valid: isValid,
    errors: validation.value,
  };
  order.render(formData);
});

events.on("order:submit", () => {
  modal.content = contacts.render();
  modal.openModal();
});

events.on("contact:change", () => {
  const validation = customer.validateForm();
  const customerData = customer.getData();
  const { email, phone } = validation;
  const isValid = !(email || phone);
  const formData = {
    email: customerData.email,
    phone: customerData.phone,
    valid: isValid,
    errors: validation.value,
  };
  contacts.render(formData);
});

events.on("contacts:submit", () => {
  const customerData = customer.getData();
  const orderData = {
    payment: customerData.payment,
    address: customerData.address,
    email: customerData.email,
    phone: customerData.phone,
    total: basket.getTotalItems(),
    items: basket.getItems().map((item) => item.id),
  };

  webLarekApiModel.sendOrder(orderData)
    .then((_order) => {
      success.sum = basket.getTotalItems();
      modal.content = success.render({ sum: basket.getTotalItems() });
      basket.clearItems();
      customer.clearData();
      order.render();
      contacts.render();
    })
    .catch(error => console.log(error));
});

events.on("done:click", () => {
  modal.closeModal();
});