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
            if (!interestedEntities) {
                console.warn("There are no entities subscribed to this notification: " + notification);
                return;
            }
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
var Components;
(function (Components) {
    var Authentication = (function () {
        function Authentication() {
            this.NAME = "Authentication";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("container");
            this.injectHTML();
            this.authContainer = document.getElementById("authentification");
            this.loginContainer = document.getElementById("authentification-log-in");
            this.loginMenuItem = document.getElementById("authentification-log-in-btn");
            this.loginEmailInput = document.getElementById("authentification-log-in-email");
            this.loginPasswordInput = document.getElementById("authentification-log-in-password");
            this.loginBtn = document.getElementById("authentification-log-in-submit");
            this.signUpContainer = document.getElementById("authentification-sign-up");
            this.signUpMenuItem = document.getElementById("authentification-sign-up-btn");
            this.signUpNameInput = document.getElementById("authentification-sign-up-name");
            this.signUpEmailInput = document.getElementById("authentification-sign-up-email");
            this.signUpPasswordInput = document.getElementById("authentification-sign-up-password");
            this.signUpBtn = document.getElementById("authentification-sign-up-submit");
            this.registerEventListeners();
        }
        Authentication.prototype.registerEventInterests = function () {
        };
        Authentication.prototype.registerEventListeners = function () {
            var _this = this;
            this.loginMenuItem.addEventListener("click", function () {
                _this.signUpContainer.setAttribute("style", "display: none");
                _this.loginContainer.setAttribute("style", "display: block");
                _this.signUpMenuItem.classList.remove("active");
                _this.loginMenuItem.classList.add("active");
            });
            this.signUpMenuItem.addEventListener("click", function () {
                _this.loginContainer.setAttribute("style", "display: none");
                _this.signUpContainer.setAttribute("style", "display: block");
                _this.loginMenuItem.classList.remove("active");
                _this.signUpMenuItem.classList.add("active");
            });
            this.loginBtn.addEventListener("click", function () {
                var email = _this.loginEmailInput.value;
                var password = _this.loginPasswordInput.value;
                if (!email || !password) {
                    console.warn("Please provide an email and a password");
                    return;
                }
                connection.login(email, password);
            });
        };
        Authentication.prototype.injectHTML = function () {
            this.container.innerHTML = "<!-- Authentification component -->\n                    <div id=\"authentification\" class=\"authentification center rad-15\">\n                        <!-- Authentification component - Header -->\n                        <div id=\"authentification-header\" class=\"authentification-header\">\n                            <div id=\"authentification-header-container\" class=\"authentification-header-container\">\n                                <ul class=\"list-clear\">\n                                    <li class=\"authentification-header-item inline f-10-13\">\n                                        <a id=\"authentification-log-in-btn\" class=\"authentification-log-in-btn authentification-btn capit active\">log in</a>\n                                    </li>\n                                    <li class=\"authentification-header-item inline f-10-13\">\n                                        <a id=\"authentification-sign-up-btn\" class=\"authentification-sign-up-btn authentification-btn capit\">sign up</a>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                        <!-- END Authentification component - Header -->\n                    \n                        <!-- Authentification component - Container -->\n                        <div id=\"authentification-container\" class=\"authentification-container\">\n                            <!-- Authentification component - Container - Log In -->\n                            <div id=\"authentification-log-in\" class=\"authentification-log-in authentification-content\">\n                                <div id=\"authentification-wrapper\" class=\"authentification-wrapper\">\n                                    <h3 class=\"authentification-title f-12-15 semi-bold\">Welcome Back!</h3>\n                                    <p class=\"f-9-13 f-777B79 desc\">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>\n                                    <div class=\"form\">\n                                        <div class=\"row\">\n                                            <input id=\"authentification-log-in-email\" class=\"authentification-log-in-email g-100 rad-4-5 f-12-15 input-icon email\" type=\"text\" placeholder=\"email\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-log-in-password\" class=\"authentification-log-in-password g-100 rad-4-5 f-12-15 input-icon password\" type=\"password\" placeholder=\"password\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <div class=\"grid poz-center\">\n                                                <div class=\"g-60 left grid poz-center\">\n                                                    <div class=\"checkbox\">\n                                                        <input id=\"authentification-log-in-remember-me\" type=\"checkbox\" class=\"checkbox\" />\n                                                        <label class=\"rad-4-5 checkbox-mark\" for=\"checkbox\"></label>\n                                                        <span class=\"f-12-15 inline label-desc semi-bold\">Remember me</span>\n                                                    </div>\n                                                </div>\n                                                <div class=\"g-40 right \">\n                                                    <a id=\"authentification-log-in-forgot-password\" class=\"authentification-log-in-forgot-password f-9-11 f-34C197\">Forgot Password?</a>\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <button id=\"authentification-log-in-submit\" class=\"authentification-log-in-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold\">log in</button>\n                                    </div>\n                                </div>\n                                <div class=\"social-desc\">\n                                    <span class=\"f-777B79 f-9-13 inline\">or log in with Facebook, Twitter or Google</span>\n                                </div>\n                            </div>\n                            <!-- END Authentification component - Container - Log In -->\n                    \n                            <!-- Authentification component - Container - Sign up -->\n                            <div id=\"authentification-sign-up\" class=\"authentification-sign-up authentification-content\" style=\"display: none;\">\n                                <div class=\"authentification-wrapper\">\n                                    <h3 class=\"authentification-title f-12-15 semi-bold\">Create Your Account!</h3>\n                                    <p class=\"f-9-13 f-777B79 desc\">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>\n                                    <div class=\"form\">\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-name\" class=\"authentification-sign-up-name g-100 rad-4-5 f-12-15 input-icon name\" type=\"text\" placeholder=\"name\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-email\" class=\"authentification-sign-up-email g-100 rad-4-5 f-12-15 input-icon email\" type=\"email\" placeholder=\"email\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-password\" class=\"authentification-sign-up-password g-100 rad-4-5 f-12-15 input-icon password\" type=\"password\" placeholder=\"password\" required>\n                                        </div>\n                                        <button id=\"authentification-sign-up-submit\" class=\"authentification-sign-up-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold\">sign up</button>\n                                    </div>\n                                </div>\n                                <div class=\"social-desc\">\n                                    <span class=\"f-777B79 f-9-13 inline\">or sign up with Facebook, Twitter or Google</span>\n                                </div>\n                            </div>\n                            <!-- END Authentification component - Container - Sign up -->\n                        </div>\n                        <!-- END  Authentification component - Container -->\n                    \n                        <!-- Authentification component - Footer -->\n                        <div class=\"authentification-footer\">\n                            <div class=\"authentification-footer-container\">\n                                <!-- Authentification component - Footer - Social Media -->\n                                <div id=\"authentification-footer-social-media\" class=\"authentification-footer-social-media inline\">\n                                    <ul class=\"list-clear\">\n                                        <li class=\"inline facebook\">\n                                            <a id=\"authentification-social-media-footer\" class=\"authentification-social-media-footer rad-18\">\n                                                <img src=\"../_bin/icons/icon-facebook.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                        <li class=\"inline twitter\">\n                                            <a id=\"authentification-social-media-twitter\" class=\"authentification-social-media-twitter rad-18\">\n                                                <img src=\"../_bin/icons/icon-twitter.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                        <li class=\"inline google\">\n                                            <a id=\"authentification-social-media-google\" class=\"authentification-social-media-google rad-18\">\n                                                <img src=\"../_bin/icons/icon-google.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <!-- END Authentification component - Footer - Social Media -->\n                            </div>\n                        </div>\n                        <!-- END Authentification component - Footer -->\n                    \n                    </div>\n                    <!-- END Authentification component -->";
        };
        Authentication.prototype.eventHandler = function (notification, data) {
        };
        return Authentication;
    }());
    Components.Authentication = Authentication;
})(Components || (Components = {}));
var Core;
(function (Core) {
    var Views = Constants.Views;
    var Notifications = Constants.Notifications;
    var Authentication = Components.Authentication;
    var ViewManager = (function () {
        function ViewManager() {
            this.NAME = "ViewManager";
            console.info(this.NAME + " has been initiated");
            this.initView(Views.AUTHENTICATION);
        }
        ViewManager.prototype.initView = function (viewname) {
            switch (viewname) {
                case Views.AUTHENTICATION:
                    new Authentication();
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
