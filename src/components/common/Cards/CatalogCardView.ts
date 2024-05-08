import { ProductCategory } from '../../../types';
import { ensureElement } from '../../../utils/utils';
import { CardView, ICard, ICardActions } from './CardView';

export type ICatalogCard = {
	image: string;
	category: ProductCategory;
};

export class CatalogCardView extends CardView implements ICatalogCard {
	protected _image: HTMLImageElement;
	protected _category: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container);

		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this._category = ensureElement<HTMLElement>('.card__category', container);

		if (actions?.onClick) {
			container.addEventListener('click', actions.onClick);
		}
	}

	set image(value: string) {
		this._image.src = value;
		this._image.alt = super.title;
	}

	set category(value: ProductCategory) {
		this._category.textContent = value;
		const category =
			Object.keys(ProductCategory)[
				Object.values(ProductCategory).indexOf(value)
			];

		this._category.className = `card__category card__category_${category}`;
	}

	render(data?: Partial<ICatalogCard & ICard>): HTMLElement {
		const { id, title, price, ...inputs } = data;
		super.render({ id, title, price });
		Object.assign(this, inputs);
		return this.container;
	}
}
