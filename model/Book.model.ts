import { Item, ItemCategory } from './item.model';

export class Book implements Item {
    getCategory(): ItemCategory {
        return ItemCategory.BOOK;
    }
    constructor(
        private id: number,
        private title: string,
        private author: string,
        private genre: string,
        private pages: number
    ) {}

    getId(): number {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getAuthor(): string {
        return this.author;
    }

    getGenre(): string {
        return this.genre;
    }

    getPages(): number {
        return this.pages;
    }
}