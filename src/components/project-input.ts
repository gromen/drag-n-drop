import { Component } from './base-component';
import { projectState } from '../state/project-state';
import { Validatable, validate } from '../utils/validation';
import { AutoBind } from '../decorators/autobind';

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
        inputTitle: HTMLInputElement;
        inputDescription: HTMLInputElement;
        inputPeople: HTMLInputElement;

        constructor() {
            super('project-input', 'app', true, 'user-input');

            this.inputTitle = this.element.querySelector('#title') as HTMLInputElement;
            this.inputDescription = this.element.querySelector('#description') as HTMLInputElement;
            this.inputPeople = this.element.querySelector('#people') as HTMLInputElement;

            this.configure()
        }

        configure() {
            this.element.addEventListener('submit', this.submitHandler)
        }

        renderContent() {}

        private userInputPayload(): [string, string, number] | void {
            const valueTitle = this.inputTitle.value;
            const valueDescription = this.inputDescription.value;
            const valuePeople = this.inputPeople.value;
            const title: Validatable = {
                value: valueTitle,
                required: true
            }
            const description: Validatable = {
                value: valueDescription,
                required: true,
                minLength: 5
            }
            const people: Validatable = {
                value: +valuePeople,
                required: true,
                min: 0
            }

            if (
                validate(title)
                && validate(description)
                && validate(people)
            ) {
                return [this.inputTitle.value, this.inputDescription.value, +this.inputPeople.value]
            }

            return
        }

        @AutoBind
        private submitHandler(event: Event) {
            event.preventDefault();
            const payload = this.userInputPayload()

            if (Array.isArray(payload)) {
                const [ title, description, people ] = payload;

                projectState.addProject(title, description, people)
                this.element.reset()
            }
        }
    }
