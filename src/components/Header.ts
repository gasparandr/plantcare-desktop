///<reference path="../constants/Notifications.ts"/>


namespace Components {
    import Notifications = Constants.Notifications;

    export class Header implements IComponent {
        public NAME: string = "Header";
        private container: HTMLElement;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.container = document.getElementById("heading");

            this.injectHTML();

            this.registerEventListeners();
        }

        public registerEventInterests(): void {
            eventDispatcher.registerEventInterest( this, Notifications.LOGIN_SUCCESS );
            eventDispatcher.registerEventInterest( this, Notifications.INVITATIONS );
        }

        public registerEventListeners(): void {

        }

        public injectHTML(): void {
            this.container.innerHTML = ``;
        }

        private switchHeaderContent(): void {

        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS :

                    console.info( "Header received login success" );
                    this.switchHeaderContent();
                    connection.pingForInvites();
                    break;

                case Notifications.INVITATIONS :


                default :
                    break;
            }
        }

    }
}