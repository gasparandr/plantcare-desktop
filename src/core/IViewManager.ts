

namespace Core {
    export interface IViewManager {
        NAME: string;
        initView(viewname: string): void;
        eventHandler(notification: string, data: any): void;

    }
}