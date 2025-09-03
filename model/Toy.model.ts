import {Item,ItemCategory} from "./item.model";

export class Toy implements Item{
    constructor(
        private id: number,
        private name: string,
        private minAge: number,
        private maxAge: number,
        private description: string,
   
    ) {
        this.id = id;
        this.name = name;
        this.minAge = minAge;
        this.maxAge = maxAge;
        this.description = description;

    }

    getMinAge(): number {
        return this.minAge;
    }

    getMaxAge(): number {
        return this.maxAge;
    }

    getDescription(): string {
        return this.description;
    }

    getId(): number {
        return this.id;
    }

    getName(): string {
        return this.name;
    }

    getCategory(): ItemCategory {
        return ItemCategory.TOY;
    }

}