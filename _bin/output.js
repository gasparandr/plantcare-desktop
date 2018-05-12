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
            this.notificationDropDown.addEventListener("click", function (e) {
                e.stopPropagation();
            });
            window.addEventListener("click", function () {
                _this.notificationDropDown.style.display = "none";
                _this.notification.classList.remove("active");
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
            this.container.innerHTML = "\n                    <div id=\"heading-container\" class=\"heading-container\">\n                        <div class=\"grid poz-center\">\n                \n                            <!-- Logo -->\n                            <div id=\"heading-logo\" class=\"heading-logo g-10\">\n                                <a class=\"inline\">\n                                    <svg width=\"91px\" height=\"22px\" viewBox=\"0 0 91 22\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                        <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" font-family=\"pacificoregular\" font-size=\"20\" font-weight=\"normal\">\n                                            <g id=\"Sign-Up\" transform=\"translate(-20.000000, -12.000000)\">\n                                                <text id=\"PlantCare\">\n                                                    <tspan x=\"20.48\" y=\"31\" fill=\"#34C197\">Plant</tspan>\n                                                    <tspan x=\"70.08\" y=\"31\" fill=\"#233B30\">Care</tspan>\n                                                </text>\n                                            </g>\n                                        </g>\n                                    </svg>\n                                </a>\n                            </div>\n                            <!-- End Logo -->\n                \n                            <div class=\"g-90\">\n                                <!-- Heading Landing -->\n                                <div id=\"heading-landing\" class=\"heading-landing right\">\n                                    <ul class=\"list-clear\">\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-support\" class=\"heading-landing-btn-support heading-landing-btn capit f-12-15\">support</a>\n                                        </li>\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-about-us\" class=\"heading-landing-btn-about-us heading-landing-btn capit f-12-15\">about us</a>\n                                        </li>\n                                        <li class=\"inline\">\n                                            <a id=\"heading-landing-btn-sign-up\" class=\"heading-landing-btn-sign-up heading-landing-btn capit f-12-15 rad-13-5 bg-FA3C65 f-ffffff\">sign\n                                                                                                                                                                                  up</a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <!-- END Heading Landing -->\n                \n                                <!-- Header after signed user-->\n                                <div id=\"heading-signed\" class=\"heading-signed\" style=\"display: none\">\n                                    <div class=\"grid\">\n                                        <div class=\"g-70\">\n                                            <div class=\"row\">\n                                                <input id=\"header-search\" class=\"header-search g-100 rad-4-5 f-12-15 input-icon search\" type=\"text\" placeholder=\"Search for anything\" required>\n                                            </div>\n                                        </div>\n                                        <div class=\"g-30 grid poz-center poz-right\">\n                \n                \n                                            <div id=\"notification\" class=\"notification inline\" >\n                                                <!-- Notification bell -->\n                                                <div id=\"notification-icon\" class=\"notification-icon\">\n                                                    <svg width=\"13px\" height=\"15px\" viewBox=\"0 0 13 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                        <g id=\"notification-bell\" stroke-width=\"1\">\n                                                            <g id=\"notifications-icon-bell\" class=\"notifications-icon-bell\" transform=\"translate(-1152.000000, -15.000000)\" fill=\"#233B30\">\n                                                                <g id=\"notifications\" transform=\"translate(1152.000000, 15.000000)\">\n                                                                    <path id=\"notifications-bell-button\" d=\"M6.38235294,15 C7.20735294,15 7.88235294,14.325 7.88235294,13.5 L4.88235294,13.5 C4.88235294,14.325 5.55735294,15 6.38235294,15 Z M11.2573529,10.5 L11.2573529,6.375 C11.2573529,4.05 9.68235294,2.175 7.50735294,1.65 L7.50735294,1.125 C7.50735294,0.525 6.98235294,0 6.38235294,0 C5.78235294,0 5.25735294,0.525 5.25735294,1.125 L5.25735294,1.65 C3.08235294,2.175 1.50735294,4.05 1.50735294,6.375 L1.50735294,10.5 L0.00735294118,12 L0.00735294118,12.75 L12.7573529,12.75 L12.7573529,12 L11.2573529,10.5 Z M9.75735294,11.25 L3.00735294,11.25 L3.00735294,6.375 C3.00735294,4.5 4.50735294,3 6.38235294,3 C8.25735294,3 9.75735294,4.5 9.75735294,6.375 L9.75735294,11.25 Z\"></path>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </svg>\n                                                </div>\n                                                <!-- END Notification bell -->\n                \n                                                <!--Notification bell - popup -->\n                                                <div id=\"notification-pop-up\" class=\"notification-pop-up\" style=\"display: none\">\n                                                    <div id=\"notification-header\" class=\"notification-header\">\n                                                        <span id=\"notification-header-desc\" class=\"notification-header-desc upper semi-bold f-34C197 f-10-13\">NOTIFICATIONS</span>\n                                                    </div>\n                                                    <div id=\"notification-container\" class=\"notification-container\">\n                                                        <ul id=\"notification-container-box\" class=\"notification-container-box list-clear\">\n                                                            \n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-DEF1FF\">\n                                                                                <span class=\"upper f-1997F0 semi-bold f-12-15\">lh</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Lawrence Hunter</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">Yesterday</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Watered all plants within </span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Outdoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-DEF1FF\">\n                                                                                <span class=\"upper f-1997F0 semi-bold f-12-15\">lh</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Lawrence Hunter</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">2 hours ago</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Added 4 new plants to plant group</span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Outdoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                \n                                                            <!-- Notification-item -->\n                                                            <li id=\"notification-item-XXX\" class=\"notification-item grid\">\n                                                                <div class=\"g-15\">\n                                                                    <div id=\"notification-item-monogram-XXX\" class=\"notification-item-monogram profile-monogram inline\">\n                                                                        <ul id=\"notification-item-monogram-list-XXX\" class=\"notification-item-monogram-list list-clear\">\n                                                                            <li id=\"notification-item-monogram-item-XXX\" class=\"profile-item inline bg-F9EBFF\">\n                                                                                <span class=\"upper f-CA53FC semi-bold f-12-15\">lw</span>\n                                                                            </li>\n                                                                        </ul>\n                                                                    </div>\n                                                                </div>\n                                                                <div class=\"g-85\">\n                                                                    <div class=\"notification-item-header grid poz-center\">\n                                                                        <div class=\"g-70\">\n                                                                            <span id=\"notification-item-name-XXX\" class=\"notification-item-name capit semi-bold f-12-15 block\">Luke Walton</span>\n                                                                        </div>\n                                                                        <div class=\"g-30 right\">\n                                                                            <span id=\"notification-item-ago-XXX\" class=\"notification-item-ago capit semi-bold f-8-10 block f-777B79\">9 May 2018</span>\n                                                                        </div>\n                                                                    </div>\n                                                                    <div id=\"notification-item-message-XXX\" class=\"notification-item-message\">\n                                                                        <span id=\"notification-item-message-desc\" class=\"notification-item-message-desc f-12-15\">Watered 3 plants within</span>\n                                                                        <span id=\"notification-item-message-group-name\" class=\"notification-item-message-group-name f-12-15 f-34C197 semi-bold\">Indoor Plants</span>\n                                                                    </div>\n                                                                </div>\n                                                            </li>\n                                                            <!-- END Notification-item -->\n                                                        </ul>\n                                                    </div>\n                                                    <div id=\"notification-footer\" class=\"notification-footer center\">\n                                                        <a id=\"notification-view-all\" class=\"notification-view-all capit semi-bold f-34C197 f-10-13\">view all</a>\n                                                    </div>\n                                                </div>\n                                                <!--Notification bell - popup-->\n                                            </div>\n                \n                                            <div id=\"profile\" class=\"profile inline grid poz-center\">\n                                                <span id=\"user-name\" class=\"user-name capit semi-bold inline\">Katie Poole</span>\n                                                <div class=\"profile-monogram inline\">\n                                                    <ul class=\"list-clear\">\n                                                        <li class=\"profile-item inline bg-DEF1FF\">\n                                                            <span class=\"upper f-1997F0 semi-bold f-12-15\">KP</span>\n                                                        </li>\n                                                    </ul>\n                                                </div>\n                                            </div>\n                                        </div>\n                \n                                    </div>\n                                </div>\n                                <!-- END Header after signed user-->\n                            </div>\n                        </div>\n                    </div>";
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
var Components;
(function (Components) {
    var Menu = (function () {
        function Menu() {
            this.NAME = "Menu";
            console.info(this.NAME + " has been initiated");
            this.registerEventInterests();
            this.container = document.getElementById("heading");
            this.injectHTML();
            this.menuItemDashboard = document.getElementById("main-menu-item-dashboard");
            this.menuItemMyPlants = document.getElementById("main-menu-item-my-plants");
            this.menuItemMyCalendar = document.getElementById("main-menu-item-my-calendar");
            this.menuItemModerators = document.getElementById("main-menu-item-my-moderators");
            this.menuItemReport = document.getElementById("main-menu-item-my-report");
            this.registerEventListeners();
        }
        Menu.prototype.registerEventInterests = function () {
        };
        Menu.prototype.registerEventListeners = function () {
            var _this = this;
            this.menuItemDashboard.addEventListener("click", function () {
                console.info("Dashboard clicked");
                _this.setActiveItem(_this.menuItemDashboard);
            });
            this.menuItemMyPlants.addEventListener("click", function () {
                console.info("My plants clicked");
                _this.setActiveItem(_this.menuItemMyPlants);
            });
            this.menuItemMyCalendar.addEventListener("click", function () {
                console.info("Calendar clicked");
                _this.setActiveItem(_this.menuItemMyCalendar);
            });
            this.menuItemModerators.addEventListener("click", function () {
                console.info("Moderators clicked");
                _this.setActiveItem(_this.menuItemModerators);
            });
            this.menuItemReport.addEventListener("click", function () {
                console.info("Reports clicked");
                _this.setActiveItem(_this.menuItemReport);
            });
        };
        Menu.prototype.injectHTML = function () {
            var menuContainer = document.createElement("div");
            menuContainer.id = "main-menu-container";
            menuContainer.className = "main-menu-container";
            menuContainer.innerHTML = "<div class=\"wrapper center\">\n                                <!-- Main menu - container -->\n                                <div class=\"main-menu\">\n                                    <ul class=\"list-clear inline\">\n                                        <li class=\"main-menu-item inline\">\n                                            <a id=\"main-menu-item-dashboard\" class=\"f-777B79 f-12-15 capit\">\n                                                <svg width=\"15px\" height=\"15px\" viewBox=\"0 0 15 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                    <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                        <g transform=\"translate(-409.000000, -61.000000)\" fill-rule=\"nonzero\">\n                                                            <g transform=\"translate(409.000000, 60.000000)\">\n                                                                <g>\n                                                                    <path class=\"icon\" id=\"dashboard-icon\" d=\"M6.78272652,16 L6.78272652,9.21880098 L0.00152749491,9.21880098 C0.00152749491,12.9626835 3.03884397,16 6.78272652,16 Z M5.49194348,14.5532219 C3.50071183,14.0699429 1.92852586,12.5008157 1.44830564,10.509584 L5.49194348,10.509584 L5.49194348,14.5532219 Z M8.22032847,1 C11.964211,1 14.9984688,4.03731648 14.9984688,7.78119902 C14.9984688,11.5250816 11.964211,14.562398 8.21726975,14.562398 L8.21726975,7.78119902 L1.43607072,7.78119902 C1.43607072,4.03731648 4.4733872,1 8.22032847,1 Z\"></path>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </g>\n                                                </svg>\n                                                <span>Dashboard</span>\n                                            </a>\n                                        </li>\n                                        <li class=\"main-menu-item inline active\">\n                                            <a id=\"main-menu-item-my-plants\" class=\"f-777B79 f-12-15 capit\">\n                                                <svg width=\"15px\" height=\"12px\" viewBox=\"0 0 15 12\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                    <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                        <g transform=\"translate(-526.000000, -62.000000)\" fill=\"#34C197\" fill-rule=\"nonzero\">\n                                                            <g transform=\"translate(409.000000, 60.000000)\">\n                                                                <g transform=\"translate(117.000000, 0.000000)\">\n                                                                    <path id=\"my-plants-icon\" class=\"icon\" d=\"M14.6989778,3.18679248 C14.8660885,3.18679248 15.0006481,3.32058332 14.9999977,3.48615545 C14.9999977,5.0851767 14.8660602,7.34418023 13.7052785,8.49857266 C13.2545971,8.94739211 12.5384729,9.19998313 11.7282023,9.19998313 C11.6890052,9.19998313 11.6497799,9.1993925 11.6099607,9.19818312 C10.8123881,9.17419246 10.0926157,8.91679206 9.67451372,8.51058205 C8.63137973,10.1185752 8.35083508,12.072197 8.35083508,13.6999902 C8.35083508,13.8655904 8.21568157,14 8.04916475,14 C7.88264793,14 7.74749442,13.8655904 7.74749442,13.6999902 C7.74749442,10.7821856 7.25275168,8.87477324 6.6331496,7.59798062 C6.17884828,7.85898103 5.58577351,8.00959064 4.98065116,8.00959064 C4.2391875,8.00959064 3.49285957,7.7935903 3.0090049,7.31239893 C1.84881705,6.15797837 1.71428571,3.89897485 1.71428571,2.29998172 C1.71428571,2.13438146 1.84943923,1.99997188 2.01598433,2 C3.62323364,2 5.89474026,2.13379084 7.05552201,3.28700201 C7.77286221,4.00039375 7.84345087,5.18721436 7.68598387,5.98700623 C7.66183215,6.1088158 7.56531008,6.20300657 7.44223243,6.2246066 C7.32096475,6.24741601 7.19607713,6.19040655 7.13151227,6.08420638 C6.40995824,4.89440453 5.59666158,4.34180366 5.15986602,4.04421257 L5.10616095,4.00821252 C5.04100219,3.96501245 4.98972926,3.92901239 4.95774378,3.90080297 C4.82683237,3.77120277 4.63497604,3.77120277 4.51732828,3.88761233 C4.39968053,4.00461251 4.39968053,4.19482218 4.51732828,4.31182237 C4.58913301,4.38323185 4.76226751,4.50082266 4.81959251,4.5398321 C5.12847443,4.74981367 5.66303641,5.12123301 6.20661993,5.82202472 C6.95775559,6.69980735 7.75292431,8.12962833 8.12939713,10.5584227 C8.64585945,8.61863847 9.78311164,6.73223552 12.0962475,5.65102446 C12.0998674,5.64922445 12.1047034,5.64981508 12.1089172,5.64801508 C12.1209648,5.64261507 12.1318246,5.63479631 12.1439005,5.62880567 C12.3562603,5.52921489 12.3767638,5.35222399 12.3128212,5.21781441 C12.2820517,5.15239555 12.2229451,5.10140485 12.1475204,5.07440481 C12.0618581,5.04439539 11.9677399,5.04740476 11.8881014,5.08520482 C10.9493233,5.52381488 10.1469147,6.12920645 9.50135093,6.88461701 C9.42171245,6.97759841 9.2937988,7.01300784 9.17736711,6.97520778 C9.06034154,6.93678897 8.97889309,6.83300755 8.97043716,6.71119799 C8.9052784,5.7889778 9.15624142,4.97419528 9.65881792,4.47438512 C10.8196279,3.32058332 13.0911346,3.18679248 14.6989778,3.18679248 Z M5.86405448,8.97958222 C5.93952383,8.97958222 6.00029269,9.0416994 5.99999894,9.11857217 C5.99999894,9.8609749 5.93951106,10.909798 5.41528705,11.4457659 C5.21175352,11.6541463 4.88834262,11.7714207 4.52241395,11.7714207 C4.50471205,11.7714207 4.48699738,11.7711465 4.46901449,11.770585 C4.10882042,11.7594465 3.78376194,11.6399392 3.59494168,11.4513417 C3.12384891,12.1979099 2.99715133,13.1049486 2.99715133,13.8607097 C2.99715133,13.9375955 2.93611426,14 2.86091311,14 C2.78571197,14 2.7246749,13.9375955 2.7246749,13.8607097 C2.7246749,12.5060147 2.50124269,11.6204304 2.2214224,11.0276339 C2.01625406,11.1488126 1.74841384,11.2187385 1.47513278,11.2187385 C1.14027823,11.2187385 0.8032269,11.1184526 0.584711889,10.8950424 C0.0607560879,10.3590614 0,9.31023832 0,8.56784866 C0,8.49096282 0.0610370704,8.42855837 0.136250987,8.42857143 C0.862105514,8.42857143 1.88794722,8.4906886 2.41217123,9.02610808 C2.73613132,9.35732567 2.76801007,9.90834952 2.69689594,10.2796815 C2.68598871,10.3362359 2.6423981,10.3799673 2.58681465,10.3899959 C2.5320486,10.400586 2.47564774,10.3741173 2.44648941,10.3248101 C2.1206263,9.7724021 1.75333104,9.51583741 1.55606852,9.37767012 L1.53181462,9.36095581 C1.50238809,9.34089864 1.47923257,9.32418433 1.46478751,9.31108709 C1.40566623,9.25091557 1.31902144,9.25091557 1.26589019,9.30496287 C1.21275895,9.35928438 1.21275895,9.44759601 1.26589019,9.50191753 C1.29831813,9.53507193 1.37650791,9.58966766 1.40239662,9.60777919 C1.54189168,9.70527063 1.78330676,9.87771532 2.0287961,10.2030829 C2.36801865,10.6106248 2.72712711,11.2744703 2.89714709,12.4021248 C3.13038814,11.5015107 3.6439859,10.6256808 4.68862789,10.1236899 C4.6902627,10.1228542 4.6924467,10.1231284 4.69434972,10.1222927 C4.69979056,10.1197856 4.70469498,10.1161554 4.7101486,10.1133741 C4.80605305,10.0671355 4.8153127,9.98496114 4.78643536,9.92255669 C4.77253949,9.89218365 4.74584615,9.86850939 4.71178341,9.85597366 C4.67309722,9.84204071 4.63059223,9.84343793 4.59462646,9.86098795 C4.17066213,10.0646283 3.80828406,10.345703 3.51673913,10.6964293 C3.48077336,10.7395993 3.42300591,10.7560394 3.37042386,10.7384893 C3.3175736,10.720652 3.28079043,10.6724678 3.27697162,10.6159134 C3.24754509,10.1877397 3.36088322,9.80944781 3.58785325,9.57739309 C4.11209004,9.0416994 5.13793174,8.97958222 5.86405448,8.97958222 Z M13.6366026,11.2966981 C13.6797279,11.2966981 13.714453,11.3301458 13.7142851,11.3715389 C13.7142851,11.7712942 13.6797206,12.3360451 13.380164,12.6246432 C13.2638592,12.736848 13.0790529,12.7999958 12.8699508,12.7999958 C12.8598355,12.7999958 12.8497128,12.7998481 12.8394369,12.7995458 C12.6336117,12.7935481 12.447864,12.729198 12.3399667,12.6276455 C12.0707708,13.0296438 11.9983722,13.5180492 11.9983722,13.9249975 C11.9983722,13.9663976 11.9634939,14 11.9205218,14 C11.8775497,14 11.8426714,13.9663976 11.8426714,13.9249975 C11.8426714,13.1955464 11.7149958,12.7186933 11.5550985,12.3994952 C11.4378595,12.4647453 11.2848079,12.5023977 11.1286473,12.5023977 C10.9373018,12.5023977 10.7447011,12.4483976 10.6198354,12.3280997 C10.3204321,12.0394946 10.2857143,11.4747437 10.2857143,11.0749954 C10.2857143,11.0335954 10.3205926,10.999993 10.363572,11 C10.778346,11 11.3645413,11.0334477 11.6640978,11.3217505 C11.8492179,11.5000984 11.8674343,11.7968036 11.8267977,11.9967516 C11.820565,12.0272039 11.7956561,12.0507516 11.7638941,12.0561517 C11.7325992,12.061854 11.7003701,12.0476016 11.6837082,12.0210516 C11.4975007,11.7236011 11.2876177,11.5854509 11.1748963,11.5110531 L11.1610369,11.5020531 C11.1442218,11.4912531 11.13099,11.4822531 11.1227357,11.4752007 C11.0889521,11.4428007 11.0394408,11.4428007 11.0090801,11.4719031 C10.9787194,11.5011531 10.9787194,11.5487055 11.0090801,11.5779556 C11.0276104,11.595808 11.0722902,11.6252057 11.0870838,11.634958 C11.1667952,11.6874534 11.3047467,11.7803083 11.4450263,11.9555062 C11.6388678,12.1749518 11.8440726,12.5324071 11.9412269,13.1396057 C12.0745075,12.6546596 12.3679919,12.1830589 12.9649302,11.9127561 C12.9658644,11.9123061 12.9671124,11.9124538 12.9681998,11.9120038 C12.9713089,11.9106538 12.9741114,11.9086991 12.9772278,11.9072014 C13.0320303,11.8823037 13.0373215,11.838056 13.0208202,11.8044536 C13.0128797,11.7880989 12.9976264,11.7753512 12.9781619,11.7686012 C12.9560556,11.7610988 12.931767,11.7618512 12.9112151,11.7713012 C12.6689498,11.8809537 12.4618766,12.0323016 12.2952795,12.2211543 C12.2747276,12.2443996 12.2417177,12.253252 12.2116708,12.2438019 C12.1814706,12.2341972 12.1604517,12.2082519 12.1582695,12.1777995 C12.1414543,11.9472444 12.206219,11.7435488 12.3359161,11.6185963 C12.63548,11.3301458 13.2216753,11.2966981 13.6366026,11.2966981 Z\"></path>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </g>\n                                                </svg>\n                                                <span>My Plants</span>\n                                            </a>\n                                        </li>\n                                        <li class=\"main-menu-item inline\">\n                                            <a id=\"main-menu-item-my-calendar\" class=\"f-777B79 f-12-15 capit\">\n                                                <svg width=\"15px\" height=\"15px\" viewBox=\"0 0 15 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                    <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                        <g transform=\"translate(-637.000000, -60.000000)\" fill=\"#777B79\" fill-rule=\"nonzero\">\n                                                            <g transform=\"translate(409.000000, 60.000000)\">\n                                                                <g transform=\"translate(228.000000, 0.000000)\">\n                                                                    <g>\n                                                                        <path id=\"calendar-2\" class=\"icon\" d=\"M5.25,8.27765755 L5.25,9.42204644 C5.25,9.60329562 5.10320377,9.75 4.92207616,9.75 L3.77774626,9.75 C3.59682583,9.75 3.45,9.60329562 3.45,9.42204644 L3.45,8.27765755 C3.45,8.09664518 3.59682583,7.95 3.77774626,7.95 L4.92207616,7.95 C5.10320377,7.95 5.25,8.09664518 5.25,8.27765755 Z M8.25,8.27765755 L8.25,9.42204644 C8.25,9.60329562 8.10315969,9.75 7.92236939,9.75 L6.7777786,9.75 C6.59684031,9.75 6.45,9.60329562 6.45,9.42204644 L6.45,8.27765755 C6.45,8.09664518 6.59684031,7.95 6.7777786,7.95 L7.92236939,7.95 C8.10315969,7.95 8.25,8.09664518 8.25,8.27765755 Z M11.25,8.27765755 L11.25,9.42204644 C11.25,9.60329562 11.1031742,9.75 10.9222537,9.75 L9.77792384,9.75 C9.59679623,9.75 9.45,9.60329562 9.45,9.42204644 L9.45,8.27765755 C9.45,8.09664518 9.59679623,7.95 9.77792384,7.95 L10.9222537,7.95 C11.1031742,7.95 11.25,8.09664518 11.25,8.27765755 Z M5.25,11.2778675 L5.25,12.4221621 C5.25,12.6032811 5.10320377,12.75 4.92207616,12.75 L3.77774626,12.75 C3.59682583,12.75 3.45,12.6033107 3.45,12.4221621 L3.45,11.2778675 C3.45,11.0965412 3.59682583,10.95 3.77774626,10.95 L4.92207616,10.95 C5.10320377,10.95 5.25,11.0965412 5.25,11.2778675 Z M8.25,11.2778675 L8.25,12.4221621 C8.25,12.6032811 8.10315969,12.75 7.92236939,12.75 L6.7777786,12.75 C6.59684031,12.75 6.45,12.6033107 6.45,12.4221621 L6.45,11.2778675 C6.45,11.0965412 6.59684031,10.95 6.7777786,10.95 L7.92236939,10.95 C8.10315969,10.95 8.25,11.0965412 8.25,11.2778675 Z M11.25,11.2778675 L11.25,12.4221621 C11.25,12.6032811 11.1031742,12.75 10.9224017,12.75 L9.77792384,12.75 C9.59679623,12.75 9.45,12.6033107 9.45,12.4221621 L9.45,11.2778675 C9.45,11.0965412 9.59679623,10.95 9.77792384,10.95 L10.9224017,10.95 C11.1031742,10.95 11.25,11.0965412 11.25,11.2778675 Z M2.7605515,4.05 C2.47857481,4.05 2.25,3.81898996 2.25,3.53365578 L2.25,0.516531225 C2.25,0.231165878 2.47857481,0 2.7605515,0 L3.6894485,0 C3.97139439,0 4.2,0.231165878 4.2,0.516531225 L4.2,3.53365578 C4.2,3.81898996 3.97139439,4.05 3.6894485,4.05 L2.7605515,4.05 Z M11.0105772,4.05 C10.7286309,4.05 10.5,3.81898996 10.5,3.53365578 L10.5,0.516531225 C10.5,0.231165878 10.7286309,0 11.0105772,0 L11.9395769,0 C12.2213999,0 12.4500308,0.231165878 12.45,0.516531225 L12.45,3.53365578 C12.45,3.81898996 12.2213691,4.05 11.9395769,4.05 L11.0105772,4.05 Z\"></path>\n                                                                        <path id=\"calendar-1\" class=\"icon\" d=\"M13.3915574,1.65652103 L13.3915574,3.47287477 C13.3915574,4.2938482 12.7247558,4.95542544 11.9029256,4.95542544 L10.9638539,4.95542544 C10.1419622,4.95542544 9.46632204,4.2938482 9.46632204,3.47287477 L9.46632204,1.65 L5.23367796,1.65 L5.23367796,3.47287477 C5.23367796,4.2938482 4.55806863,4.95542544 3.73630004,4.95542544 L2.79704355,4.95542544 C1.97524417,4.95542544 1.30847338,4.2938482 1.30847338,3.47287477 L1.30847338,1.65652103 C0.590211175,1.67814502 0,2.27177433 0,3.00142254 L0,13.6461167 C0,14.3894837 0.603238011,15 1.3474923,15 L13.3525077,15 C14.0956533,15 14.7,14.3882225 14.7,13.6461167 L14.7,3.00142254 C14.7,2.27177433 14.1098196,1.67814502 13.3915574,1.65652103 Z M12.9553894,12.9832475 C12.9553894,13.3045007 12.6946062,13.5651267 12.3728465,13.5651267 L2.30150022,13.5651267 C1.97974043,13.5651267 1.71895733,13.3045007 1.71895733,12.9832475 L1.71895733,7.48487872 C1.71895733,7.16350254 1.97970963,6.90287654 2.30150022,6.90287654 L12.3728157,6.90287654 C12.6945755,6.90287654 12.9553586,7.16350254 12.9553586,7.48487872 L12.9553894,12.9832475 Z\"></path>\n                                                                    </g>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </g>\n                                                </svg>\n                                                <span>Calendar</span>\n                                            </a>\n                                        </li>\n                                        <li class=\"main-menu-item inline\">\n                                            <a id=\"main-menu-item-my-moderators\" class=\"f-777B79 f-12-15 capit\">\n                                                <svg width=\"11px\" height=\"15px\" viewBox=\"0 0 11 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                    <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                        <g transform=\"translate(-742.000000, -60.000000)\" fill=\"#777B79\" fill-rule=\"nonzero\">\n                                                            <g transform=\"translate(409.000000, 60.000000)\">\n                                                                <g transform=\"translate(333.000000, 0.000000)\">\n                                                                    <g>\n                                                                        <path id=\"moderator-2\" class=\"icon\" d=\"M3.68673913,9.08445652 C4.22608696,9.48423913 4.84826087,9.72456522 5.52326087,9.7248913 C6.19858696,9.7248913 6.82141304,9.48423913 7.36076087,9.08413043 L7.36076087,10.5583696 C7.36076087,11.0413043 6.96945652,11.4322826 6.48717391,11.4322826 L4.56032609,11.4322826 C4.07771739,11.4322826 3.68673913,11.0409783 3.68673913,10.5583696 L3.68673913,9.08445652 Z M8.42119565,8.93315217 C9.92021739,9.30847826 10.9715217,10.6552174 10.9721739,12.2008696 L10.9721739,14.2294565 C10.9721739,14.628913 10.6483696,14.9605435 10.2492391,14.9605435 L8.83402174,14.9605435 L8.83402174,11.8425 C8.83402174,11.6155435 8.6501087,11.4322826 8.42380435,11.4322826 L8.42119565,8.93315217 Z M0.075326087,12.2005435 C0.075326087,10.6552174 1.12663043,9.30847826 2.62565217,8.93282609 L2.62532609,11.4319565 C2.3973913,11.4319565 2.21315217,11.6165217 2.21315217,11.8441304 L2.21315217,14.9602174 L0.79826087,14.9602174 C0.399130435,14.9602174 0.075326087,14.628913 0.075326087,14.2291304 L0.075326087,12.2005435 Z\"></path>\n                                                                        <path id=\"moderator-1\" class=\"icon\" d=\"M9.3273913,5.60967391 C9.38445652,4.91478261 9.16173913,4.61967391 8.87152174,4.49771739 C8.86728261,4.38391304 8.91554348,3.915 8.91554348,3.78554348 C8.91554348,2.20630435 7.44358696,0.696847826 6.0825,0.3675 C6.09097826,0.346304348 6.09554348,0.324130435 6.09554348,0.300978261 C6.09554348,0.134673913 5.85423913,-1.77635684e-15 5.55521739,-1.77635684e-15 C5.25652174,-1.77635684e-15 5.01456522,0.135 5.01456522,0.300978261 C5.01456522,0.327391304 5.02076087,0.352826087 5.03184783,0.376956522 C3.75456522,0.725217391 2.19554348,2.22097826 2.19554348,3.78521739 C2.19554348,3.88076087 2.20141304,3.97565217 2.2098913,4.06891304 C2.19684783,4.21141304 2.18771739,4.36076087 2.18184783,4.51695652 C1.91315217,4.65 1.71456522,4.94934783 1.76869565,5.60967391 C1.82641304,6.30326087 2.16652174,6.6273913 2.5425,6.72228261 C3.08706522,8.10032609 4.18891304,9.22173913 5.52717391,9.22173913 C6.86152174,9.22173913 7.96206522,8.10586957 8.50728261,6.73304348 C8.90184783,6.65315217 9.2673913,6.33195652 9.3273913,5.60967391 Z M5.52684783,8.55163043 C4.04152174,8.55163043 2.84543478,6.53021739 2.84543478,4.85673913 C2.84543478,4.7475 2.84771739,4.6425 2.85130435,4.54076087 L3.285,4.96695652 C3.4751087,5.15380435 3.77380435,5.16880435 3.9825,5.00282609 C4.30695652,4.74456522 4.88967391,4.5701087 5.5548913,4.5701087 C6.2201087,4.5701087 6.80282609,4.74456522 7.12728261,5.00282609 C7.33532609,5.16847826 7.63467391,5.15347826 7.82445652,4.96728261 L8.20467391,4.59423913 C8.20663043,4.67934783 8.20793478,4.76673913 8.20793478,4.85673913 C8.2076087,6.53021739 7.01152174,8.55163043 5.52684783,8.55163043 Z\"></path>\n                                                                    </g>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </g>\n                                                </svg>\n                                                <span>Moderators</span>\n                                            </a>\n                                        </li>\n                                        <li class=\"main-menu-item inline\">\n                                            <a id=\"main-menu-item-my-report\" class=\"f-777B79 f-12-15 capit\">\n                                                <svg width=\"14px\" height=\"15px\" viewBox=\"0 0 14 15\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                                    <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                        <g transform=\"translate(-857.000000, -60.000000)\">\n                                                            <g transform=\"translate(409.000000, 60.000000)\">\n                                                                <g transform=\"translate(448.000000, 0.000000)\">\n                                                                    <g>\n                                                                        <path id=\"report-2\" class=\"icon\" d=\"M6,0 L8,0 C8.55228475,-1.01453063e-16 9,0.44771525 9,1 L9,15 L5,15 L5,1 C5,0.44771525 5.44771525,1.01453063e-16 6,0 Z M11,9 L13,9 C13.5522847,9 14,9.44771525 14,10 L14,15 L10,15 L10,10 C10,9.44771525 10.4477153,9 11,9 Z\"></path>\n                                                                        <path id=\"report-1\" class=\"icon border\" d=\"M0.5,14.5 L3.5,14.5 L3.5,6 C3.5,5.72385763 3.27614237,5.5 3,5.5 L1,5.5 C0.723857625,5.5 0.5,5.72385763 0.5,6 L0.5,14.5 Z\"></path>\n                                                                    </g>\n                                                                </g>\n                                                            </g>\n                                                        </g>\n                                                    </g>\n                                                </svg>\n                                                <span>Report</span>\n                                            </a>\n                                        </li>\n                                    </ul>\n                                </div>\n                                <!-- END Main menu - container -->\n                    \n                                <!-- Add Plant group / members / ... -->\n                                <div id=\"add-object\" class=\"add-object\">\n                                    <a id=\"add-object-btn\" class=\"add-object-btn bg-34C197 rad-50\">\n                                        <svg width=\"16px\" height=\"16px\" viewBox=\"0 0 16 16\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\">\n                                            <g stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\">\n                                                <g transform=\"translate(-1139.000000, -82.000000)\" fill=\"#FFFFFF\" fill-rule=\"nonzero\">\n                                                    <g transform=\"translate(1128.000000, 71.000000)\">\n                                                        <path id=\"add-icon-white\"  d=\"M25.9743712,17.9083344 L20.0916294,17.9083344 L20.0916294,12.0255368 C20.0916294,11.7575513 19.7277317,11.1764706 18.9999682,11.1764706 C18.2722047,11.1764706 17.908307,11.7575831 17.908307,12.0255368 L17.908307,17.9083662 L12.0255333,17.9083662 C11.7575807,17.9083344 11.1764706,18.2722335 11.1764706,18.9999682 C11.1764706,19.7277029 11.7575807,20.0916338 12.0255333,20.0916338 L17.9083388,20.0916338 L17.9083388,25.9744632 C17.9083388,26.2423851 18.2722047,26.8235294 19,26.8235294 C19.7277953,26.8235294 20.0916612,26.2423851 20.0916612,25.9744632 L20.0916612,20.0916338 L25.9744667,20.0916338 C26.2423875,20.0916338 26.8235294,19.7277665 26.8235294,18.9999682 C26.8235294,18.2721699 26.2423239,17.9083344 25.9743712,17.9083344 Z\"></path>\n                                                    </g>\n                                                </g>\n                                            </g>\n                                        </svg>\n                                    </a>\n                                </div>\n                                <!-- END  Add Plant group / members / ... -->\n                    \n                            </div>";
            this.container.appendChild(menuContainer);
        };
        Menu.prototype.setActiveItem = function (item) {
            var siblings = item.parentElement.parentElement.children;
            for (var i = 0; i < siblings.length; i++) {
                siblings[i].classList.remove("active");
            }
            item.parentElement.classList.add("active");
        };
        Menu.prototype.eventHandler = function (notification, data) {
            switch (notification) {
            }
        };
        return Menu;
    }());
    Components.Menu = Menu;
})(Components || (Components = {}));
var Core;
(function (Core) {
    var Views = Constants.Views;
    var Notifications = Constants.Notifications;
    var Authentication = Components.Authentication;
    var Header = Components.Header;
    var Menu = Components.Menu;
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
                    new Menu();
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
