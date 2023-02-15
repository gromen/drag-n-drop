import { Draggable } from '../model/drag-and-drop.js';
import { Project } from '../model/project.js';
import { AutoBind } from '../decorators/autobind.js';
import { Component } from './base-component.js';

export class ProjectListItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
        private project: Project;
        dragged: HTMLLIElement | null = null;

        get persons() {
            if (this.project.people === 1) {
                return '1 person assigned';
            }

            return `${this.project.people} persons assigned`;
        }

        constructor(idHost: string, project: Project) {
            super('single-project', idHost, false, project.id);
            this.project = project;

            this.configure();
            this.renderContent();
        }

        @AutoBind
        handlerDragStart(event: DragEvent) {
            this.dragged = event.target as HTMLLIElement;
            event.dataTransfer!.setData('text/plain', this.project.id)
            event.dataTransfer!.effectAllowed = 'move';
        }

        handlerDragEnd() {}

        configure() {
            this.element.addEventListener("dragstart", this.handlerDragStart);
        }

        renderContent() {
            this.element.querySelector('h2')!.textContent = this.project.title;
            this.element.querySelector('h3')!.textContent = this.project.description;
            this.element.querySelector('p')!.textContent = this.persons;
        }
    }
