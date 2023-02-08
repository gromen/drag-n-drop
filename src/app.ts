interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

function AutoBind(_: any, _2: string | Symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    return {
        configurable: true,
        get() {
            return originalMethod.bind(this);
        },
    }
}

class ProjectInput {
    elementTemplate: HTMLTemplateElement;
    elementHost: HTMLDivElement;
    elementForm: HTMLFormElement;
    inputTitle: HTMLInputElement;
    inputDescription: HTMLInputElement;
    inputPeople: HTMLInputElement;

    constructor() {
        this.elementTemplate = document.getElementById('project-input')! as HTMLTemplateElement;
        this.elementHost = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.elementTemplate.content, true);
        this.elementForm = importedNode.firstElementChild as HTMLFormElement;
        this.elementForm.id = 'user-input';
        this.inputTitle = this.elementForm.querySelector('#title') as HTMLInputElement;
        this.inputDescription = this.elementForm.querySelector('#description') as HTMLInputElement;
        this.inputPeople = this.elementForm.querySelector('#people') as HTMLInputElement;

        this.render()
        this.attachEvents()
    }

    private validate(input: Validatable): boolean {
        let isValid = true;

        if (input.required) {
            isValid = isValid &&  input.value.toString().trim().length > 0
        }
        if (input.minLength !== undefined && typeof input.value === 'string') {
            isValid = isValid && input.value.trim().length >= input.minLength
        }
        if (input.maxLength !== undefined && typeof input.value === 'string') {
            isValid = isValid && input.value.trim().length <= input.maxLength
        }
        if (typeof input.value === 'number' && input.max !== undefined) {
            isValid = isValid && input.value <= input.max
        }
        if (typeof input.value === 'number' && input.min !== undefined) {
            isValid = isValid && input.value >= input.min
        }

        return isValid;
    }

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
            min: 2
        }

        if (
            this.validate(title)
            && this.validate(description)
            && this.validate(people)
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
            console.log(payload)
            this.elementForm.reset()
        }
    }

    private attachEvents() {
        this.elementForm.addEventListener('submit', this.submitHandler)
    }

    private render() {
        this.elementHost.insertAdjacentElement('afterbegin', this.elementForm)
    }

}

const projectInput = new ProjectInput()


