namespace App {
    export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
        elementTemplate: HTMLTemplateElement;
        elementHost: T;
        element: U;

        protected constructor(
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
                this.element.id = idElement;
            }
            this.render(insertAtStart)
        }

        private render(insertAtBeginning: boolean) {
            this.elementHost.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element)
        }

        abstract configure(): void;
        abstract renderContent(): void;
    }
}
