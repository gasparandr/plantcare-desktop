

namespace Components {

    export class Authentication implements IComponent{
        public NAME: string = "Authentication";

        constructor() {
            console.info( this.NAME + " has been initiated");
        }


        public registerEventInterests(): void {

        }

        public registerEventListeners(): void {

        }


        public eventHandler(notification: string, data: any): void {

        }



    }

}