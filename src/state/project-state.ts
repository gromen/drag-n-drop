import { Project, ProjectStatus } from '../model/project.js'

type Listener<T> = (items: T[]) => void;

class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

export class ProjectState extends State<Project>{
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
        this.updateListeners();
    }

    updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn([...this.projects])
        }
    }

    moveProject(idProject: string, statusNew: ProjectStatus) {
        const project = this.projects.find(project => project.id === idProject);
        if (project && project.status !== statusNew) {
            project.status = statusNew
            this.updateListeners();
        }
    }
}

export const projectState = ProjectState.getInstance();
