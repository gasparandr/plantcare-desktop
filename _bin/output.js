var Core;
(function (Core) {
    var Observer = (function () {
        function Observer() {
            this.NAME = "Observer";
            console.info(this.NAME + " has been initiated");
            this.notificationInterests = {};
        }
        Observer.prototype.registerEventInterest = function (entity, notification) {
            console.info("Registering " + entity.NAME + " for notification " + notification);
            if (!this.notificationInterests[notification]) {
                this.notificationInterests[notification] = [];
                this.notificationInterests[notification].push(entity);
            }
            else {
                for (var i = 0; i < this.notificationInterests[notification].length; i++) {
                    if (this.notificationInterests[notification][i].NAME == entity.NAME) {
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
            this.invitations = [];
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
            var self = this;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/invitations/" + this.userId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {
                var response = JSON.parse(this.responseText);
                console.log(response);
                console.log("invitations length:" + self.invitations.length);
                console.log("response length:" + response.length);
                if (self.invitations.length !== response.length) {
                    self.invitations = response;
                    eventDispatcher.sendNotification(Notifications.INVITATIONS, response);
                }
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
            console.info("Ping for invites started");
            var self = this;
            this.ping = setInterval(function () {
                console.info("Connection pinging for invitations every " + self.pingDelay + " ms");
                var xhr = new XMLHttpRequest();
                xhr.open('GET', self.address + "/invitations/" + self.userId, true);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.onload = function () {
                    var response = JSON.parse(this.responseText);
                    console.log(response);
                    if (self.invitations.length !== response.length) {
                        self.invitations = response;
                        eventDispatcher.sendNotification(Notifications.INVITATIONS, response);
                    }
                };
                xhr.send();
            }, self.pingDelay);
        };
        Proxy.prototype.cancelPing = function () {
            clearInterval(this.ping);
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
            this.container.innerHTML = "<!-- Authentification component -->\n                    <div id=\"authentification\" class=\"authentification center rad-15\">\n                        <!-- Authentification component - Header -->\n                        <div id=\"authentification-header\" class=\"authentification-header\">\n                            <div id=\"authentification-header-container\" class=\"authentification-header-container\">\n                                <ul class=\"list-clear\">\n                                    <li class=\"authentification-header-item inline f-10-13\">\n                                        <a id=\"authentification-log-in-btn\" class=\"authentification-log-in-btn authentification-btn capit active\">log in</a>\n                                    </li>\n                                    <li class=\"authentification-header-item inline f-10-13\">\n                                        <a id=\"authentification-sign-up-btn\" class=\"authentification-sign-up-btn authentification-btn capit\">sign up</a>\n                                    </li>\n                                </ul>\n                            </div>\n                        </div>\n                        <!-- END Authentification component - Header -->\n                    \n                        <!-- Authentification component - Container -->\n                        <div id=\"authentification-container\" class=\"authentification-container\">\n                            <!-- Authentification component - Container - Log In -->\n                            <div id=\"authentification-log-in\" class=\"authentification-log-in authentification-content\">\n                                <div id=\"authentification-wrapper\" class=\"authentification-wrapper\">\n                                    <h3 class=\"authentification-title f-12-15 semi-bold\">Welcome Back!</h3>\n                                    <p class=\"f-9-13 f-777B79 desc\">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>\n                                    <div class=\"form\">\n                                        <div class=\"row\">\n                                            <input id=\"authentification-log-in-email\" class=\"authentification-log-in-email g-100 rad-4-5 f-12-15 input-icon email\" type=\"text\" placeholder=\"email\" required value=\"desktop@plantcare.com\">\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-log-in-password\" class=\"authentification-log-in-password g-100 rad-4-5 f-12-15 input-icon password\" type=\"password\" placeholder=\"password\" required value=\"asd123\">\n                                        </div>\n                                        <div class=\"row\">\n                                            <div class=\"grid poz-center\">\n                                                <div class=\"g-60 left grid poz-center\">\n                                                    <div class=\"checkbox\">\n                                                        <input id=\"authentification-log-in-remember-me\" type=\"checkbox\" class=\"checkbox\" />\n                                                        <label class=\"rad-4-5 checkbox-mark\" for=\"checkbox\"></label>\n                                                        <span class=\"f-12-15 inline label-desc semi-bold\">Remember me</span>\n                                                    </div>\n                                                </div>\n                                                <div class=\"g-40 right \">\n                                                    <a id=\"authentification-log-in-forgot-password\" class=\"authentification-log-in-forgot-password f-9-11 f-34C197\">Forgot Password?</a>\n                                                </div>\n                                            </div>\n                                        </div>\n                                        <button id=\"authentification-log-in-submit\" class=\"authentification-log-in-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold\">log in</button>\n                                    </div>\n                                </div>\n                                <div class=\"social-desc\">\n                                    <span class=\"f-777B79 f-9-13 inline\">or log in with Facebook, Twitter or Google</span>\n                                </div>\n                            </div>\n                            <!-- END Authentification component - Container - Log In -->\n                    \n                            <!-- Authentification component - Container - Sign up -->\n                            <div id=\"authentification-sign-up\" class=\"authentification-sign-up authentification-content\" style=\"display: none;\">\n                                <div class=\"authentification-wrapper\">\n                                    <h3 class=\"authentification-title f-12-15 semi-bold\">Create Your Account!</h3>\n                                    <p class=\"f-9-13 f-777B79 desc\">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>\n                                    <div class=\"form\">\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-name\" class=\"authentification-sign-up-name g-100 rad-4-5 f-12-15 input-icon name\" type=\"text\" placeholder=\"name\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-email\" class=\"authentification-sign-up-email g-100 rad-4-5 f-12-15 input-icon email\" type=\"email\" placeholder=\"email\" required>\n                                        </div>\n                                        <div class=\"row\">\n                                            <input id=\"authentification-sign-up-password\" class=\"authentification-sign-up-password g-100 rad-4-5 f-12-15 input-icon password\" type=\"password\" placeholder=\"password\" required>\n                                        </div>\n                                        <button id=\"authentification-sign-up-submit\" class=\"authentification-sign-up-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold\">sign up</button>\n                                    </div>\n                                </div>\n                                <div class=\"social-desc\">\n                                    <span class=\"f-777B79 f-9-13 inline\">or sign up with Facebook, Twitter or Google</span>\n                                </div>\n                            </div>\n                            <!-- END Authentification component - Container - Sign up -->\n                        </div>\n                        <!-- END  Authentification component - Container -->\n                    \n                        <!-- Authentification component - Footer -->\n                        <div class=\"authentification-footer\">\n                            <div class=\"authentification-footer-container\">\n                                <!-- Authentification component - Footer - Social Media -->\n                                <div id=\"authentification-footer-social-media\" class=\"authentification-footer-social-media inline\">\n                                    <ul class=\"list-clear\">\n                                        <li class=\"inline facebook\">\n                                            <a id=\"authentification-social-media-footer\" class=\"authentification-social-media-footer rad-18\">\n                                                <img src=\"../_bin/icons/icon-facebook.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                        <li class=\"inline twitter\">\n                                            <a id=\"authentification-social-media-twitter\" class=\"authentification-social-media-twitter rad-18\">\n                                                <img src=\"../_bin/icons/icon-twitter.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                        <li class=\"inline google\">\n                                            <a id=\"authentification-social-media-google\" class=\"authentification-social-media-google rad-18\">\n                                                <img src=\"../_bin/icons/icon-google.svg\" alt=\"\">\n                                            </a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <!-- END Authentification component - Footer - Social Media -->\n                            </div>\n                        </div>\n                        <!-- END Authentification component - Footer -->\n                    \n                    </div>\n                    <!-- END Authentification component -->";
        };
        Authentication.prototype.eventHandler = function (notification, data) {
            switch (notification) {
            }
        };
        return Authentication;
    }());
    Components.Authentication = Authentication;
})(Components || (Components = {}));
var Components;
(function (Components) {
    var Notifications = Constants.Notifications;
    var Header = (function () {
        function Header() {
            this.NAME = "Header";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("heading");
            this.injectHTML();
            this.headerLandingContent = document.getElementById("heading-landing");
            this.headerSignedInContent = document.getElementById("heading-signed");
            this.notificationDropDown = document.getElementById("notification-pop-up");
            this.notificationContainer = document.getElementById("notification-container-box");
            this.notificationIcon = document.getElementById("notification-icon");
            this.notification = document.getElementById("notification");
            this.registerEventListeners();
        }
        Header.prototype.registerEventInterests = function () {
            eventDispatcher.registerEventInterest(this, Notifications.LOGIN_SUCCESS);
            eventDispatcher.registerEventInterest(this, Notifications.INVITATIONS);
        };
        Header.prototype.registerEventListeners = function () {
            var _this = this;
            this.notificationIcon.addEventListener("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
                _this.notification.classList.toggle("active");
                _this.notification.classList.remove("notification-alert");
                _this.notificationDropDown.style.display = _this.notificationDropDown.style.display === 'none' ? 'block' : 'none';
            });
        };
        Header.prototype.addInvitation = function (invitation) {
            var inv = document.createElement("li");
            inv.id = invitation._id;
            inv.className = "notification-item grid new";
            inv.innerHTML = "<div class=\"g-15\">\n                                <div id=\"notification-item-monogram-" + invitation._id + "\" class=\"notification-item-monogram profile-monogram inline\">\n                                    <ul id=\"notification-item-monogram-list-" + invitation._id + "\" class=\"notification-item-monogram-list list-clear\">\n                                        <li id=\"notification-item-monogram-item-" + invitation._id + "\" class=\"profile-item inline bg-FFE4EC\">\n                                            <span class=\"upper f-F01959 semi-bold f-12-15\">ma</span>\n                                        </li>\n                                    </ul>\n                                </div>\n                            </div>\n                            <div class=\"g-85\">\n                                <div class=\"notification-item-header grid poz-center\">\n                                    <div class=\"g-70\">\n                                        <span id=\"notification-item-name-" + invitation._id + "\" class=\"notification-item-name capit semi-bold f-12-15 block\">" + invitation.inviteFrom + "</span>\n                                    </div>\n                                    <div class=\"g-30 right\">\n                                        <div id=\"notification-item-ago-" + invitation._id + "\" class=\"notification-item-ago upper semi-bold bg-FA3C65 rad-5 inline\">\n                                            <span class=\"upper f-8-10 f-ffffff\">new</span>\n                                        </div>\n                                    </div>\n                                </div>\n                                <div id=\"notification-item-message-" + invitation._id + "\" class=\"notification-item-message\">\n                                    <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">" + invitation.message + "</span>\n                                    <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">" + invitation.plantGroupName + "</span>\n                                </div>\n    \n                                <!-- Notification item confirmations -->\n                                <div id=\"notification-item-confirmation-" + invitation._id + "\" class=\"notification-item-confirmation g-100 block\">\n                                    <a id=\"notification-item-accept-" + invitation._id + "\" class=\"notification-item-accept bg-1997F0 semi-bold f-ffffff notification-item-confirm-btn f-12-15 rad-4\">Accept</a>\n                                    <a id=\"notification-item-decline-" + invitation._id + "\" class=\"notification-item-decline f-1997F0 semi-bold notification-item-confirm-btn f-12-15 rad-4\">Decline</a>\n                                </div>\n                                <!-- END Notification item confirmations -->\n                            </div>";
            this.notificationContainer.insertBefore(inv, this.notificationContainer.firstChild);
            this.notification.classList.add("notification-alert");
            var responseContainer = document.getElementById("notification-item-confirmation-" + invitation._id);
            var acceptBtn = document.getElementById("notification-item-accept-" + invitation._id);
            var cancelBtn = document.getElementById("notification-item-decline-" + invitation._id);
            acceptBtn.addEventListener("click", function () {
                responseContainer.setAttribute("style", "display:none");
            });
            cancelBtn.addEventListener("click", function () {
                responseContainer.setAttribute("style", "display:none");
            });
        };
        Header.prototype.injectHTML = function () {
            this.container.innerHTML = "<!DOCTYPE html>\n                <html lang=\"en\">\n                <head>\n                    <meta charset=\"UTF-8\">\n                    <title>PlantCare Desktop App - Authentification </title>\n                \n                \n                    <link rel=\"stylesheet\" href=\"../_bin/style/css/helper.css\">\n                    <link rel=\"stylesheet\" href=\"../_bin/style/css/font-face.css\">\n                    <link rel=\"stylesheet\" href=\"../_bin/style/css/font-style.css\">\n                \n                    <!-- Component -->\n                    <link rel=\"stylesheet\" href=\"../_bin/style/css/heading.css\">\n                    <!-- END Component -->\n                \n                \n                </head>\n                <body>\n                \n                \n                <!-- Heading-->\n                <header id=\"heading\" class=\"heading g-100\">\n                    <div id=\"heading-container\" class=\"heading-container\">\n                        <div class=\"grid poz-center\">\n                \n                            <!-- Logo -->\n                            <div id=\"heading-logo\" class=\"heading-logo g-10\">\n                                <a class=\"inline\">\n                                    <svg width=\"91px\" height=\"22px\" viewBox=\"0 0 91 22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                        <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" font-family=\"pacificoregular\" font-size=\"20\" font-weight=\"normal\">\n                                            <g id=\"Sign-Up\" transform=\"translate(-20.000000, -12.000000)\">\n                                                <text id=\"PlantCare\">\n                                                    <tspan x=\"20.48\" y=\"31\" fill=\"#34C197\">Plant</tspan>\n                                                    <tspan x=\"70.08\" y=\"31\" fill=\"#233B30\">Care</tspan>\n                                                </text>\n                                            </g>\n                                        </g>\n                                    </svg>\n                                </a>\n                            </div>\n                            <!-- End Logo -->\n                \n                            <div class=\"g-90\">\n                                <!-- Heading Landing -->\n                                <div id=\"heading-landing\" class=\"heading-landing right\">\n                                    <ul class=\"list-clear\">\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-support\" class=\"heading-landing-btn-support heading-landing-btn capit f-12-15\">support</a>\n                                        </li>\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-about-us\" class=\"heading-landing-btn-about-us heading-landing-btn capit f-12-15\">about us</a>\n                                        </li>\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-sign-up\" class=\"heading-landing-btn-sign-up heading-landing-btn capit f-12-15 rad-13-5 bg-FA3C65 f-ffffff\">sign\n                                                                                                                                                                                  up</a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <!-- END Heading Landing -->\n                \n                                <!-- Header after signed user-->\n                                <div id=\"heading-signed\" class=\"heading-signed\" style=\"display: none\">\n                                    <div class=\"grid\">\n                                        <div class=\"g-70\">\n                                            <div class=\"row\">\n                                                <input id=\"header-search\" class=\"header-search g-100 rad-4-5 f-12-15 input-icon search\" type=\"text\" placeholder=\"Search for anything\" required>\n                                            </div>\n                                        </div>\n                                        <div class=\"g-30 grid poz-center poz-right\">\n                \n                \n                                            <div id=\"notification\" class=\"notification inline\" >\n                                                <!-- Notification bell -->\n                                                <div id=\"notification-icon\" class=\"notification-icon\">\n                                                    <svg width=\"13px\" height=\"15px\" viewBox=\"0 0 13 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                        <g id=\"notification-bell\" stroke-width=\"1\">\n                                                            <g id=\"notifications-icon-bell\" class=\"notifications-icon-bell\" transform=\"translate(-1152.000000, -15.000000)\" fill=\"#233B30\">\n                                                                <g id=\"notifications\" transform=\"translate(1152.000000, 15.000000)\">\n                                                                    <path id=\"notifications-bell-button\" d=\"M6.38235294,15 C7.20735294,15 7.88235294,14.325 7.88235294,13.5 L4.88235294,13.5 C4.88235294,14.325 5.55735294,15 6.38235294,15 Z M11.2573529,10.5 L11.2573529,6.375 C11.2573529,4.05 9.68235294,2.175 7.50735294,1.65 L7.50735294,1.125 C7.50735294,0.525 6.98235294,0 6.38235294,0 C5.78235294,0 5.25735294,0.525 5.25735294,1.125 L5.25735294,1.65 C3.08235294,2.175 1.50735294,4.05 1.50735294,6.375 L1.50735294,10.5 L0.00735294118,12 L0.00735294118,12.75 L12.7573529,12.75 L12.7573529,12 L11.2573529,10.5 Z M9.75735294,11.25 L3.00735294,11.25 L3.00735294,6.375 C3.00735294,4.5 4.50735294,3 6.38235294,3 C8.25735294,3 9.75735294,4.5 9.75735294,6.375 L9.75735294,11.25 Z\"></path>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </svg>\n                                                </div>\n                                                <!-- END Notification bell -->\n                \n                                                <!--Notification bell - popup -->\n                                                <div id=\"notification-pop-up\" class=\"notification-pop-up\" style=\"display: none\">\n                                                    <div id=\"notification-header\" class=\"notification-header\">\n                                                        <span id=\"notification-header-desc\" class=\"notification-header-desc upper semi-bold f-34C197 f-10-13\">NOTIFICATIONS</span>\n                                                    </div>\n                                                    <div id=\"notification-container\" class=\"notification-container\">\n                                                        <ul id=\"notification-container-box\" class=\"notification-container-box list-clear\">\n                                                            \n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-DEF1FF\">\n                                                                                <span class=\"upper f-1997F0 semi-bold f-12-15\">lh</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Lawrence Hunter</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">Yesterday</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Watered all plants within </span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Outdoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-DEF1FF\">\n                                                                                <span class=\"upper f-1997F0 semi-bold f-12-15\">lh</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Lawrence Hunter</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">2 hours ago</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Added 4 new plants to plant group</span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Outdoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-F9EBFF\">\n                                                                                <span class=\"upper f-CA53FC semi-bold f-12-15\">lw</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Luke Walton</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">9 May 2018</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Watered 3 plants within</span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Indoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                                                        </ul>\n                                                    </div>\n                                                    <div id=\"notification-footer\" class=\"notification-footer center\">\n                                                        <a id=\"notification-view-all\" class=\"notification-view-all capit semi-bold f-34C197 f-10-13\">view all</a>\n                                                    </div>\n                                                </div>\n                                                <!--Notification bell - popup-->\n                                            </div>\n                \n                                            <div id=\"profile\" class=\"profile inline grid poz-center\">\n                                                <span id=\"user-name\" class=\"user-name capit semi-bold inline\">Katie Poole</span>\n                                                <div class=\"profile-monogram inline\">\n                                                    <ul class=\"list-clear\">\n                                                        <li class=\"profile-item inline bg-DEF1FF\">\n                                                            <span class=\"upper f-1997F0 semi-bold f-12-15\">KP</span>\n                                                        </li>\n                                                    </ul>\n                                                </div>\n                                            </div>\n                                        </div>\n                \n                                    </div>\n                                </div>\n                                <!-- END Header after signed user-->\n                            </div>\n                        </div>\n                    </div>\n                \n                \n                \n                \n                </header>\n                <!-- END Heading-->\n                \n                \n                </body>\n                </html>";
        };
        Header.prototype.switchHeaderContent = function () {
            this.headerLandingContent.setAttribute("style", "display:none");
            this.headerSignedInContent.setAttribute("style", "display:block");
        };
        Header.prototype.eventHandler = function (notification, data) {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS:
                    console.info("Header received login success.");
                    this.switchHeaderContent();
                    connection.pingForInvites();
                    break;
                case Notifications.INVITATIONS:
                    for (var i = 0; i < data.length; i++) {
                        this.addInvitation(data[i]);
                    }
                    break;
                default:
                    break;
            }
        };
        return Header;
    }());
    Components.Header = Header;
})(Components || (Components = {}));
var Core;
(function (Core) {
    var Views = Constants.Views;
    var Notifications = Constants.Notifications;
    var Authentication = Components.Authentication;
    var Header = Components.Header;
    var ViewManager = (function () {
        function ViewManager() {
            this.NAME = "ViewManager";
            this.registerEventInterests();
            console.info(this.NAME + " has been initiated");
            this.heading = document.getElementById("heading");
            this.container = document.getElementById("container");
            this.initView(Views.AUTHENTICATION);
        }
        ViewManager.prototype.registerEventInterests = function () {
            eventDispatcher.registerEventInterest(this, Notifications.LOGIN_SUCCESS);
            eventDispatcher.registerEventInterest(this, Notifications.LOGIN_FAILURE);
        };
        ViewManager.prototype.initView = function (viewname) {
            switch (viewname) {
                case Views.AUTHENTICATION:
                    console.info("Initiating AUTHENTICATION view");
                    document.body.classList.add("landing-page");
                    new Header();
                    new Authentication();
                    break;
                case Views.MY_PLANTS:
                    console.info("Initiating MY PLANTS view");
                    document.body.classList.remove("landing-page");
                    this.container.innerHTML = "";
                    break;
                default:
                    break;
            }
        };
        ViewManager.prototype.eventHandler = function (notification, data) {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS:
                    this.initView(Views.MY_PLANTS);
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
console.info("Initiating PlantCare core components");
var eventDispatcher = new Observer();
var connection = new Proxy();
var viewManager = new ViewManager();
var Components;
(function (Components) {
    var Menu = (function () {
        function Menu() {
            this.NAME = "Menu";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("heading");
            this.injectHTML();
            this.registerEventListeners();
        }
        Menu.prototype.registerEventInterests = function () {
        };
        Menu.prototype.registerEventListeners = function () {
        };
        Menu.prototype.injectHTML = function () {
        };
        Menu.prototype.eventHandler = function (notification, data) {
            switch (notification) {
            }
        };
        return Menu;
    }());
    Components.Menu = Menu;
})(Components || (Components = {}));
var Components;
(function (Components) {
    var PlantGroupCard = (function () {
        function PlantGroupCard() {
            this.NAME = "PlantGroupCard";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("container");
            this.registerEventListeners();
        }
        PlantGroupCard.prototype.registerEventInterests = function () {
        };
        PlantGroupCard.prototype.registerEventListeners = function () {
        };
        PlantGroupCard.prototype.injectHTML = function () {
        };
        PlantGroupCard.prototype.eventHandler = function (notification, data) {
            switch (notification) {
            }
        };
        return PlantGroupCard;
    }());
    Components.PlantGroupCard = PlantGroupCard;
})(Components || (Components = {}));
var Components;
(function (Components) {
    var SubMenu = (function () {
        function SubMenu() {
            this.NAME = "SubMenu";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("heading");
            this.injectHTML();
            this.registerEventListeners();
        }
        SubMenu.prototype.injectHTML = function () {
        };
        SubMenu.prototype.registerEventInterests = function () {
        };
        SubMenu.prototype.registerEventListeners = function () {
        };
        SubMenu.prototype.eventHandler = function (notification, data) {
            switch (notification) {
            }
        };
        return SubMenu;
    }());
    Components.SubMenu = SubMenu;
})(Components || (Components = {}));
