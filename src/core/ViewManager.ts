///<reference path="../constants/Views.ts"/>
///<reference path="../constants/Notifications.ts"/>
///<reference path="IViewManager.ts"/>
///<reference path="../components/Authentication.ts"/>
///<reference path="../components/Header.ts"/>
///<reference path="../components/Menu.ts"/>


namespace Core {
    import Views = Constants.Views;
    import Notifications = Constants.Notifications;
    import Authentication = Components.Authentication;
    import Header = Components.Header;
    import Menu = Components.Menu;

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
            eventDispatcher.registerEventInterest(this, Notifications.INIT_DASHBOARD );
            eventDispatcher.registerEventInterest(this, Notifications.INIT_MY_PLANTS );
            eventDispatcher.registerEventInterest(this, Notifications.INIT_CALENDAR );
            eventDispatcher.registerEventInterest(this, Notifications.INIT_MODERATORS );
            eventDispatcher.registerEventInterest(this, Notifications.INIT_REPORTS );
        }

        public initView(viewname: string): void {
            switch (viewname) {
                case Views.AUTHENTICATION :
                    console.info("Initiating AUTHENTICATION view" );
                    document.body.classList.add("landing-page");
                    new Header();
                    new Authentication();
                    break;

                case Views.MY_PLANTS :
                    console.info("Initiating MY PLANTS view" );
                    document.body.classList.remove("landing-page");
                    this.container.innerHTML = "";

                    new Menu();

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

                case Notifications.INIT_DASHBOARD :
                    break;

                case Notifications.INIT_MY_PLANTS :
                    break;

                case Notifications.INIT_CALENDAR :
                    break;

                case Notifications.INIT_MODERATORS :
                    break;

                case Notifications.INIT_REPORTS :
                    break;

                default :
                    break;
            }
        }


    }
}