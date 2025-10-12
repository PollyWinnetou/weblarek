import { IApi, IProduct, IOrder } from "../../types";

export class WebLarekApi {
  protected api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  getProducts(): Promise<IProduct[]> {
    return this.api.get<{ total: number; items: IProduct[] }>("/product/").then(data => data.items);
  }

  sendOrder(orderData: IOrder): Promise<IOrder> {
    return this.api.post("/order/", orderData);
  }
}
