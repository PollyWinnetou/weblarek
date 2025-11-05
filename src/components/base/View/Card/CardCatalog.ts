import { ensureElement } from "../../../../utils/utils";
import { Card } from "./Card";
import { categoryMap, CDN_URL } from "../../../../utils/constants";
import { IProduct } from "../../../../types";

interface ICardActions {
  onClick: (event: MouseEvent) => void
}

export class CardCatalog extends Card<IProduct> {
  protected cardCategory: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, actions: ICardActions) {
    super(container);
    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.className = 'card__category';
    const modi = (categoryMap as Record<string, string>)[value.toLowerCase()];
    if (modi) {
        this.cardCategory.classList.add(modi);
    }
  }

  set image(value: string) {
    this.imageElement.src = `${CDN_URL}/${value}`;
    this.imageElement.alt = `${this.cardTitle.textContent}`;
  }
}