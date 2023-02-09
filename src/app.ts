interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public people: number,
        public status: ProjectStatus
    ) {
    }
}

type Listener = (items: Project[]) => void;

class ProjectState {
    private listeners: Listener[] = [];
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
    }

    addListener(listenerFn: Listener) {
        this.listeners.push(listenerFn);
    }

    addProject(title: string, description: string, numOfPeople: number) {
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject)
        for (const listenerFn of this.listeners) {
            listenerFn([...this.projects])
        }
    }
}

const projectState = ProjectState.getInstance();

class ProjectList {
    elementTemplate: HTMLTemplateElement;
    elementHost: HTMLDivElement;
    element: HTMLElement;
    projects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        this.elementTemplate = document.getElementById('project-list') as HTMLTemplateElement;
        this.elementHost = document.getElementById('app')! as HTMLDivElement;
        const importedNode = document.importNode(this.elementTemplate.content, true);
        this.element = importedNode.firstElementChild as HTMLElement;

        projectState.addListener((projects: Project[]) => {
            const filteredProjects = projects.filter(project => {
                if (this.type === 'active') {
                    return project.status === ProjectStatus.Active
                }

                return project.status === ProjectStatus.Finished
            })
            this.projects = filteredProjects;
            this.renderProjects();
        });

        this.render();
        this.renderContent();
    }

    private renderProjects() {
        const elementList = document.querySelector(`.projects--${this.type} ul`)!;
        const elementListItem = document.createElement('li')
        for (const project of this.projects) {
            elementListItem.textContent = project.title;
            elementList.appendChild(elementListItem);
        }
    }

    private renderContent() {
        this.element.classList.add(`projects--${this.type}`);
        this.element.querySelector('h2')!.textContent = `${this.type} projects`.toUpperCase();
    }

    private render() {
        this.elementHost.insertAdjacentElement('beforeend', this.element)
    }
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
            min: 0
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
            const [ title, description, people ] = payload;

            projectState.addProject(title, description, people)
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

new ProjectInput()
new ProjectList('active')
new ProjectList('finished')


