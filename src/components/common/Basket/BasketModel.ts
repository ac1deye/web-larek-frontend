import { IBasketModel, IProduct } from '../../../types';
import { IEvents } from '../../base/events';

export type BasketChangeEvent = {
	basket: IProduct[];
};

export class BasketModel implements IBasketModel {
	items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	get totalPrice(): number {
		return this.items.length > 0
			? this.items.map((item) => item.price).reduce((a, b) => a + b)
			: 0;
	}

	add(product: IProduct): void {
		if (!this.items.some((item) => item.id == product.id)) {
			this.items.push(product);
			this.events.emit<BasketChangeEvent>('basket:changed', {
				basket: this.items,
			});
		}
	}

	remove(id: string): void {
		if (this.items.some((item) => item.id == id)) {
			this.items = this.items.filter((item) => item.id !== id);
			this.events.emit<BasketChangeEvent>('basket:changed', {
				basket: this.items,
			});
		}
	}
	contains(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}

	reset() {
		this.items = [];
		this.events.emit<BasketChangeEvent>('basket:changed', {
			basket: this.items,
		});
	}
}
