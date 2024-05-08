import { IProduct } from '../../../types';
import { cloneTemplate } from '../../../utils/utils';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';
import { ICardActions } from '../Cards/CardView';
import { CatalogCardView } from '../Cards/CatalogCardView';

export class CatalogView extends Component<IProduct[]> {
	constructor(
		container: HTMLElement,
		protected template: HTMLTemplateElement,
		protected events: IEvents,
		protected actions: ICardActions
	) {
		super(container);
	}

	render(data?: Partial<IProduct[]>): HTMLElement {
		const cards = data.map((item) => {
			const card = new CatalogCardView(
				cloneTemplate(this.template),
				this.actions
			);
			return card.render(item);
		});

		this.container.replaceChildren(...cards);

		return this.container;
	}
}
