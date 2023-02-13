namespace App {
    export interface Draggable {
        handlerDragStart(event: DragEvent): void;
        handlerDragEnd(event: DragEvent): void;
    }

    export interface Droppable {
        handlerDragOver(event: DragEvent): void
        handlerDragLeave(event: DragEvent): void
        handlerDropZone(event: DragEvent): void
    }
}
