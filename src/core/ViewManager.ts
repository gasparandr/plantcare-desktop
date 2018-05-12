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

        constructor() {
            console.info( this.NAME + " has been initiated");

            this.initView( Views.AUTHENTICATION );

        }



        public initView(viewname: string): void {
            switch (viewname) {
                case Views.AUTHENTICATION :
                    new Authentication();
                    break;
                default :
                    break;
            }
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS :
                    break;
                case Notifications.LOGIN_FAILURE :
                    break;
                default :
                    break;
            }
        }


    }
}