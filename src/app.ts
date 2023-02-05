// Code goes here!
class ProjectInput {
    elementTemplate: HTMLTemplateElement
    elementHost: HTMLDivElement
    elementForm: HTMLFormElement
    constructor() {
        //@ts-ignore
        this.elementTemplate = document.getElementById('project-input')! as HTMLTemplateElement
        this.elementHost = document.getElementById('app')! as HTMLDivElement
        const importedNode = document.importNode(this.elementTemplate.content, true)
        this.elementForm = importedNode.firstElementChild as HTMLFormElement

        console.log(importedNode)
        this.render()
    }

    private render() {
        this.elementHost.insertAdjacentElement('afterbegin', this.elementForm)
    }

}

const projectInput = new ProjectInput()


