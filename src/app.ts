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

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

class ProjectState extends State<Project>{
    private projects: Project[] = [];
    private static instance: ProjectState;

    private constructor() {
        super()
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    elementTemplate: HTMLTemplateElement;
    elementHost: T;
    element: U;

    constructor(
        idTemplate: string,
        idElementHost: string,
        insertAtStart: boolean = false,
        idElement?: string
    ) {
        this.elementTemplate = document.getElementById(idTemplate) as HTMLTemplateElement;
        this.elementHost = document.getElementById(idElementHost)! as T;
        const importedNode = document.importNode(this.elementTemplate.content, true);
        this.element = importedNode.firstElementChild as U;
        if (idElement) {
            this.element.classList.add(idElement)
        }
        this.render(insertAtStart)
    }

    private render(insertAtBeginning: boolean) {
        this.elementHost.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element)
    }

    abstract configure(): void;
    abstract renderContent(): void;
}

class ProjectList extends Component<HTMLDivElement, HTMLElement>{
    projects: Project[] = [];

    constructor(private type: 'active' | 'finished') {
        super('project-list', 'app', false, `projects--${type}`)

        this.renderContent();
        this.configure()
    }

    configure() {
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
    }

    renderContent() {
        this.element.querySelector('h2')!.textContent = `${this.type} projects`.toUpperCase();
    }

    renderProjects() {
        const elementList = document.querySelector(`.projects--${this.type} ul`)!;
        const elementListItem = document.createElement('li')
        for (const project of this.projects) {
            elementListItem.textContent = project.title;
            elementList.appendChild(elementListItem);
        }
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

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
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
            this.element.reset()
        }
    }
}

new ProjectInput()
new ProjectList('active')
new ProjectList('finished')


