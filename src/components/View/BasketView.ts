import { IBasketView } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export class BasketView extends Component<IBasketView> {
  protected basketList: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected basketPrice: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".button.basket__button",
      this.container
    );
    this.basketPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );

    this.basketButton.disabled = true;

    this.basketButton.addEventListener("click", () => {
      events.emit("basket:create");
    });
  }

  set listProducts(value: HTMLElement[]) {
    this.basketList.replaceChildren(...value);
  }

  set totalPrice(value: number) {
    this.basketPrice.textContent = `${value.toString()} синапсов`;
  }

  set valid(isValid: boolean) {
    this.basketButton.disabled = !isValid;
  }
}