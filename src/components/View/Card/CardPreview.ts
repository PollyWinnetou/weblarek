import { ensureElement } from "../../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../utils/constants";
import { IEvents } from "../../base/Events";
import { IProduct } from "../../../types";

export class CardPreview extends Card<IProduct & { buttonText: string }> {
  protected cardCategory: HTMLElement;
  protected cardDescription: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardDescription = ensureElement<HTMLElement>(
      ".card__text",
      this.container
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.buttonElement.addEventListener("click", () => {
      this.events.emit("product:button-click");
    });
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = "card__category";
    const modi = (categoryMap as Record<string, string>)[value.toLowerCase()];
    if (modi) {
      this.cardCategory.classList.add(modi);
    }
  }

  set image(value: string) {
    this.imageElement.src = `${CDN_URL}/${value}`;
    this.imageElement.alt = `${this.cardTitle.textContent}`;
  }
  set description(value: string) {
    this.cardDescription.textContent = value;
  }

  set buttonText(value: string) {
    if (value === "Недоступно") {
      this.buttonElement.disabled = true;
    } else {
      this.buttonElement.disabled = false;
    }
    this.buttonElement.textContent = value;
  }
}
