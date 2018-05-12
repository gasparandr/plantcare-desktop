///<reference path="../constants/Views.ts"/>
///<reference path="../constants/Notifications.ts"/>
///<reference path="IViewManager.ts"/>
///<reference path="../components/Authentication.ts"/>


namespace Core {
    import Views = Constants.Views;
    import Notifications = Constants.Notifications;
    import Authentication = Components.Authentication;

    export class ViewManager implements IViewManager{
        public NAME: string = "ViewManager";
        private heading: HTMLElement;
        private container: HTMLElement;

        constructor() {
            this.registerEventInterests();
            console.info( this.NAME + " has been initiated");

            this.heading = document.getElementById( "heading" );
            this.container = document.getElementById( "container" );

            this.initView( Views.AUTHENTICATION );

        }

        public registerEventInterests(): void {
            eventDispatcher.registerEventInterest(this, Notifications.LOGIN_SUCCESS );
            eventDispatcher.registerEventInterest(this, Notifications.LOGIN_FAILURE );
        }

        public initView(viewname: string): void {
            switch (viewname) {
                case Views.AUTHENTICATION :
                    console.info("Initiating AUTHENTICATION view" );
                    new Authentication();
                    break;

                case Views.MY_PLANTS :
                    console.info("Initiating MY PLANTS view" );
                    this.container.innerHTML = "";

                    break;


                default :
                    break;
            }
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS :
                    this.initView( Views.MY_PLANTS );
                    break;
                case Notifications.LOGIN_FAILURE :
                    break;
                default :
                    break;
            }
        }


    }
}