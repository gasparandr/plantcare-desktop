///<reference path="../constants/Views.ts"/>
///<reference path="../constants/Notifications.ts"/>


namespace Core {
    import Views = Constants.Views;
    import Notifications = Constants.Notifications;

    export class ViewManager implements IViewManager{
        public NAME: string = "ViewManager";

        constructor() {

        }



        public initView(viewname: string): void {
            switch (viewname) {
                case Views.Authentication :
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