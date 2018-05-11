

namespace Components {
    export interface IComponent {
        eventHandler(notification: string, data: any): void;
    }

}