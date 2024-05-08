import { IModalRouter } from '../../../types';
import { Component } from '../../base/Component';
import { IEvents } from '../../base/events';
import { Modal } from './Modal';

export class ModalRouter implements IModalRouter {
	modal: Modal;

	constructor(container: HTMLElement, events: IEvents) {
		this.modal = new Modal(container, events);
	}

	close() {
		this.modal.close();
	}

	route<T>(to: Component<T>, data?: Partial<T>): void {
		this.modal.render({ content: to.render(data) });
	}
}
