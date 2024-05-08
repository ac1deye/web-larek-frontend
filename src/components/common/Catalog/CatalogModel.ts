import { ICatalogModel, IProduct } from '../../../types';
import { IEvents } from '../../base/events';

export type CatalogChangeEvent = {
	products: IProduct[];
};

export class CatalogModel implements ICatalogModel {
	items: IProduct[] = [];

	constructor(protected events: IEvents) {}

	setItems(items: IProduct[]) {
		this.items = items;
		this.events.emit<CatalogChangeEvent>('catalog:change', { products: items });
	}

	getItem(id: string): IProduct | undefined {
		return this.items.find((item) => item.id === id);
	}
}
