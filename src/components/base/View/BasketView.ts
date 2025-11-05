import { ensureElement } from "../../../utils/utils";
import { Component } from "../Component";
import { IEvents } from "../Events";

interface IBasketView {
  listProducts: HTMLElement[];
  totalPrice: number;
}

export class BasketView extends Component<IBasketView> {
  protected basketList: HTMLElement;
  protected basketButton: HTMLElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLElement>('.button.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this.basketButton.addEventListener('click', () => {
      events.emit('basket:create');
    })
  }

  set listProducts(value: HTMLElement[]) {
    this.basketList.replaceChildren(...value);
  }

  set totalPrice(value: number) {
    this.basketPrice.textContent = `${value.toString()} синапсов`;
  }
}