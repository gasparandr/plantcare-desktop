

namespace Core {
    export interface IViewManager {
        NAME: string;
        initView(viewname: string, data: any): void;
        registerEventInterests(): void;
        eventHandler(notification: string, data: any): void;

    }
}