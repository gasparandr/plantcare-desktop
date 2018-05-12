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
var Constants;
(function (Constants) {
    var Notifications = (function () {
        function Notifications() {
        }
        Notifications.LOGIN_SUCCESS = "LOGIN_SUCCESS";
        Notifications.LOGIN_FAILURE = "LOGIN_FAILURE";
        Notifications.PLANT_GROUPS = "PLANT_GROUPS";
        Notifications.INVITATIONS = "INVITATIONS";
        Notifications.PLANT_WATER_SUCCESS = "PLANT_WATER_SUCCESS";
        Notifications.PLANT_GROUP_WATER_SUCCESS = "PLANT_GROUP_WATER_SUCCESS";
        Notifications.PLANTS_ARRIVED = "PLANTS_ARRIVED";
        return Notifications;
    }());
    Constants.Notifications = Notifications;
})(Constants || (Constants = {}));
var Core;
(function (Core) {
    var Notifications = Constants.Notifications;
    var Proxy = (function () {
        function Proxy() {
            this.NAME = "Proxy";
            console.info(this.NAME + " has been initiated");
            this.address = "http://10.10.0.42:1337";
            this.pingDelay = 2000;
        }
        Proxy.prototype.login = function (email, password) {
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('POST', this.address + "/login", true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                self.userId = response.userId;
                self.name = response.name;
                console.log(response);
                if (response.success) {
                    console.log("LOGIN SUCCESS");
                    eventDispatcher.sendNotification(Notifications.LOGIN_SUCCESS, response);
                }
                else {
                    console.log("LOGIN FAILURE! " + response.message);
                }
            };
            xhr.send(JSON.stringify({ email: email, password: password }));
        };
        Proxy.prototype.getPlants = function (plantGroupId) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/plant-group/plants/" + plantGroupId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                eventDispatcher.sendNotification(Notifications.PLANTS_ARRIVED, response);
            };
            xhr.send();
        };
        Proxy.prototype.getPlantGroups = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/plant-groups/" + this.userId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                eventDispatcher.sendNotification(Notifications.PLANT_GROUPS, response);
            };
            xhr.send();
        };
        Proxy.prototype.invite = function (plantGroupId) {
        };
        Proxy.prototype.getInvitations = function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/invitations/" + this.userId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                eventDispatcher.sendNotification(Notifications.INVITATIONS, response);
            };
            xhr.send();
        };
        Proxy.prototype.waterPlant = function (plantId) {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', this.address + "/plant/water/" + plantId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                eventDispatcher.sendNotification(Notifications.PLANT_WATER_SUCCESS, response);
            };
            xhr.send();
        };
        Proxy.prototype.waterPlantGroup = function (plantGroupId) {
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', this.address + "/plant-group/water/" + plantGroupId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                eventDispatcher.sendNotification(Notifications.PLANT_GROUP_WATER_SUCCESS, response);
            };
            xhr.send();
        };
        Proxy.prototype.pingForInvites = function () {
            var self = this;
            this.ping = setTimeout(function () {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', self.address + "/invitations/" + self.userId, true);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.onload = function () {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    eventDispatcher.sendNotification(Notifications.INVITATIONS, response);
                };
                xhr.send();
            }, this.pingDelay);
        };
        Proxy.prototype.cancelPing = function () {
            clearTimeout(this.ping);
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
        Views.AUTHENTICATION = "AUTHENTICATION";
        Views.MY_PLANTS = "MY_PLANTS";
        Views.DASHBOARD = "DASHBOARD";
        Views.PLANT_GROUP_DETAIL = "PLANT_GROUP_DETAIL";
        return Views;
    }());
    Constants.Views = Views;
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
                case Views.AUTHENTICATION:
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
console.info("Initiating plantcare core components");
var eventDispatcher = new Observer();
var connection = new Proxy();
var viewManager = new ViewManager();
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
