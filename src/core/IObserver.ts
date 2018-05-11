

namespace Core {
    export interface IObserver {
        registerEventInterest(entity: any, notification:string): void;
        sendNotification(notification: string, data: any): void;
    }

}
