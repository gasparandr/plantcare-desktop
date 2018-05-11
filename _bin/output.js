var Core;
(function (Core) {
    var Observer = (function () {
        function Observer() {
            this.NAME = "Observer";
            console.info(this.NAME + " has been initiated");
            this.notificationInterests = {};
        }
        Observer.prototype.registerEventInterest = function (entity, notification) {
            if (!this.notificationInterests[notification]) {
                this.notificationInterests[notification] = [];
                this.notificationInterests[notification].push(entity);
            }
            else {
                for (var i = 0; i < this.notificationInterests[notification].length; i++) {
                    if (this.notificationInterests[notification][i].NAME = entity.NAME) {
                        console.warn(entity.NAME + " is already registered to the notification " + notification);
                        return;
                    }
                }
                this.notificationInterests[notification].push(entity);
            }
        };
        Observer.prototype.sendNotification = function (notification, data) {
            var interestedEntities = this.notificationInterests[notification];
            for (var i = 0; i < interestedEntities.length; i++) {
                interestedEntities[i].eventHandler(notification, data);
            }
            if (!interestedEntities.length)
                console.warn("There is no entity interested in the notification: " + notification);
        };
        return Observer;
    }());
    Core.Observer = Observer;
})(Core || (Core = {}));
var Core;
(function (Core) {
    var Proxy = (function () {
        function Proxy() {
            this.NAME = "Proxy";
            console.info(this.NAME + " has been initiated");
            this.address = "";
        }
        Proxy.prototype.login = function (email, password) {
        };
        Proxy.prototype.getPlants = function (plantGroupId) {
        };
        Proxy.prototype.getPlantGroups = function () {
        };
        Proxy.prototype.invite = function () {
        };
        Proxy.prototype.getInvites = function () {
        };
        Proxy.prototype.waterPlant = function (plantId) {
        };
        Proxy.prototype.waterPlantGroup = function (plantGroupId) {
        };
        Proxy.prototype.pingForInvites = function () {
        };
        Proxy.prototype.cancelPing = function () {
        };
        return Proxy;
    }());
    Core.Proxy = Proxy;
})(Core || (Core = {}));
var Constants;
(function (Constants) {
    var Views = (function () {
        function Views() {
        }
        Views.Authentication = "Authentication";
        return Views;
    }());
    Constants.Views = Views;
})(Constants || (Constants = {}));
var Constants;
(function (Constants) {
    var Notifications = (function () {
        function Notifications() {
        }
        Notifications.LOGIN_SUCCESS = "LOGIN_SUCCESS";
        Notifications.LOGIN_FAILURE = "LOGIN_FAILURE";
        return Notifications;
    }());
    Constants.Notifications = Notifications;
})(Constants || (Constants = {}));
var Core;
(function (Core) {
    var Views = Constants.Views;
    var Notifications = Constants.Notifications;
    var ViewManager = (function () {
        function ViewManager() {
            this.NAME = "ViewManager";
            console.info(this.NAME + " has been initiated");
        }
        ViewManager.prototype.initView = function (viewname) {
            switch (viewname) {
                case Views.Authentication:
                    break;
                default:
                    break;
            }
        };
        ViewManager.prototype.eventHandler = function (notification, data) {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS:
                    break;
                case Notifications.LOGIN_FAILURE:
                    break;
                default:
                    break;
            }
        };
        return ViewManager;
    }());
    Core.ViewManager = ViewManager;
})(Core || (Core = {}));
var Observer = Core.Observer;
var Proxy = Core.Proxy;
var ViewManager = Core.ViewManager;
var EntryPoint;
(function (EntryPoint) {
    console.info("Initiating plantcare core components");
    var eventDispatcher = new Observer();
    var connection = new Proxy();
    var viewManager = new ViewManager();
})(EntryPoint || (EntryPoint = {}));
var Components;
(function (Components) {
    var Authentication = (function () {
        function Authentication() {
            this.NAME = "Authentication";
            console.info(this.NAME + " has been initiated");
        }
        Authentication.prototype.registerEventInterests = function () {
        };
        Authentication.prototype.registerEventListeners = function () {
        };
        Authentication.prototype.eventHandler = function (notification, data) {
        };
        return Authentication;
    }());
    Components.Authentication = Authentication;
})(Components || (Components = {}));
