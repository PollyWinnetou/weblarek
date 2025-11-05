import { IBuyer } from "../../../types/index.ts";
import { IEvents } from "../Events.ts";

export class Customer implements IBuyer {
  public payment: "cash" | "card" | "";
  public email: string;
  public phone: string;
  public address: string;
  protected events: IEvents;


  constructor(
    payment: "cash" | "card" | "",
    email: string,
    phone: string,
    address: string, 
    events: IEvents
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.events = events;
  }

  setPayment(payment: "cash" | "card" | ""): void {
    this.payment = payment;
    this.events.emit('form:change');
  }

  setAddress(address: string): void {
    this.address = address;
    this.events.emit('form:change');
  }

  setEmail(email: string): void {
    this.email = email;
    this.events.emit('form:change');
  }

  setPhone(phone: string): void {
    this.phone = phone;
    this.events.emit('form:change');
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      email: this.email,
      phone: this.phone,
    };
  }

  clearPayment(): void {
    this.payment = "";
  }

  clearAddress(): void {
    this.address = "";
  }

  clearEmail(): void {
    this.email = "";
  }

  clearPhone(): void {
    this.phone = "";
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
