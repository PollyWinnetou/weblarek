import { IBuyer } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Customer implements IBuyer {
  public payment: "cash" | "card" | "";
  public email: string;
  public phone: string;
  public address: string;
  protected events: IEvents;


  constructor(
    events: IEvents,
    payment: "cash" | "card" | "" = "",
    email: string = "",
    phone: string = "",
    address: string = ""
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.events = events;
  }

  setPayment(payment: "cash" | "card" | ""): void {
    this.payment = payment;
    this.events.emit('order:change');
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('order:change');
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('contact:change');
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('contact:change');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearData(): void {
    this.payment = '';
    this.address = '';
    this.email = '';
    this.phone = '';
    this.events.emit("order:change");
    this.events.emit("contact:change");
  }

  validateForm(): { [key: string]: string } {
    const errors: { [key: string]: string } = {};

    if (!this.payment || this.payment === undefined) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.address || this.address === undefined) {
      errors.address = "Введите адрес доставки";
    }
    if (!this.phone || this.phone === undefined) {
      errors.phone = "Введите номер телефона";
    }
    if (!this.email || this.email === undefined) {
      errors.email = "Введите почту";
    }
    return errors;
  }
}
