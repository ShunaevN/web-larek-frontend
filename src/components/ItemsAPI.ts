import { Api, ApiListResponse } from "./base/api";
import { IItem, IOrder, IOrderSuccess } from "../types";

export interface IItemsAPI {
    getItemList: () => Promise<IItem[]>;
    getItem: (id: string) => Promise<IItem>;
    orderItems: (order: IOrder) => Promise<IOrderSuccess>;
}

export class ItemsAPI extends Api implements IItemsAPI {
    readonly cdn: string;
    constructor(cdn: string, baseUrl: string, options?: RequestInit){
        super(baseUrl, options);
        this.cdn = cdn;
    }

    getItem(id: string): Promise<IItem> {
        return this.get(`/product/${id}`).then(
            (item: IItem) => ({
                ...item,
                image: this.cdn + item.image,
            })
        );
    }
    
    getItemList(): Promise<IItem[]>{
        return this.get('/product').then((data: ApiListResponse<IItem>) =>
            data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            }))
        );
    }

    orderItems(order: IOrder): Promise<IOrderSuccess> {
        return this.post('/order', order).then(
            (data: IOrderSuccess) => data
        );
    }
}


