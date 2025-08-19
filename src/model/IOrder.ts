import { IItem } from "./IItem";

export interface IOrder{
    getItems(): IItem;
    getPrice(): number;
    getQuantity(): number;
    getId(): string;
}