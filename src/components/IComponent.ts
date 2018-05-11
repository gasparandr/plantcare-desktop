

namespace Components {
    export interface IComponent {
        NAME: string;
        eventHandler(notification: string, data: any): void;
        registerEventInterests(): void;
        registerEventListeners(): void;
    }

}