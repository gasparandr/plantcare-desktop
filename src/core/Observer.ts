

namespace Core {
    export class Observer implements IObserver{
        public NAME: string = "Observer";
        private notificationInterests: any;


        constructor() {
            console.info( this.NAME + " has been initiated");
            this.notificationInterests = {};
        }

        public registerEventInterest(entity: any, notification:string): void {

            if ( ! this.notificationInterests[ notification ] ) {
                this.notificationInterests[ notification ] = [];
                this.notificationInterests[ notification ].push(entity);
            } else {
                for (let i = 0; i < this.notificationInterests[notification].length; i++) {
                    if (  this.notificationInterests[notification][i].NAME = entity.NAME ) {
                        console.warn(entity.NAME + " is already registered to the notification " + notification);
                        return;
                    }
                }

                this.notificationInterests[notification].push(entity);
            }

        }

        public sendNotification(notification: string, data: any) {
            const interestedEntities = this.notificationInterests[ notification ];

            for (let i = 0; i < interestedEntities.length; i++) {
                interestedEntities[i].eventHandler( notification, data );
            }

            if ( ! interestedEntities.length ) console.warn("There is no entity interested in the notification: " + notification);
        }


    }
}