import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IHeader } from "../../types";

export class Header extends Component<IHeader> {
  basketButton: HTMLElement;
  counterElement: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.basketButton = ensureElement<HTMLElement>(
      ".header__basket",
      this.container
    );
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.basketButton
    );

    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }

  set сounter(value: number) {
    this.counterElement.textContent = value.toString();
  }
}
