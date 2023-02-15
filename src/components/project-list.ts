/// <reference path="base-component.ts" />
/// <reference path="project-item.ts" />
/// <reference path="../state/project-state.ts" />
/// <reference path="../model/drag-and-drop.ts" />
/// <reference path="../decorators/autobind.ts" />

namespace App {
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements Droppable {
        projects: Project[] = [];

        constructor(private type: 'active' | 'finished') {
            super('project-list', 'app', false, `projects-${type}`)

            this.renderContent();
            this.configure()
        }

        @AutoBind
        handlerDragOver(event: DragEvent) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const list = this.element.querySelector('ul')! as HTMLUListElement;

                list.classList.add('droppable');
            }
        }

        @AutoBind
        handlerDragLeave(_: DragEvent) {
            const list = this.element.querySelector('ul') as HTMLUListElement;
            list.classList.remove('droppable')

        }

        @AutoBind
        handlerDropZone(event: DragEvent) {
            const idProject = event.dataTransfer!.getData('text/plain');
            projectState.moveProject(idProject, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished)
            this.element.querySelector('ul')!.classList.remove('droppable')
            this.renderProjects()
        }

        configure() {
            this.element.addEventListener('dragover', this.handlerDragOver);
            this.element.addEventListener('dragleave', this.handlerDragLeave);
            this.element.addEventListener('drop', this.handlerDropZone);

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
            this.element.querySelector('ul')!.id = `projects-${this.type}-list`;
        }

        renderProjects() {
            const listElement = document.getElementById(`projects-${this.type}-list`)!;
            listElement.innerHTML = '';

            for (const project of this.projects) {
                new ProjectListItem(this.element.querySelector('ul')!.id, project)
            }
        }
    }
}
