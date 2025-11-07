import { ensureElement } from "../../utils/utils"; 
import { Component } from "../base/Component"; 
import { IEvents } from "../base/Events"; 

export interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  closeButton: HTMLButtonElement;
  contentModal: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentModal = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', this.closeModal.bind(this));
    this.container.addEventListener('click', this.closeModal.bind(this));
    this.contentModal.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(content: HTMLElement) {
    this.contentModal.replaceChildren(content);
  }

  openModal(): void {
    this.container.classList.add('modal_active');
  }
  closeModal(): void {
    this.container.classList.remove('modal_active');
  }
}