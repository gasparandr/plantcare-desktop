///<reference path="../constants/Notifications.ts"/>
///<reference path="IComponent.ts"/>
///<reference path="../EntryPoint.ts"/>


namespace Components {
    import Notifications = Constants.Notifications;

    export class Header implements IComponent {
        public NAME: string = "Header";
        private container: HTMLElement;
        private headerLandingContent: HTMLElement;
        private headerSignedInContent: HTMLElement;
        private notificationDropDown: HTMLElement;
        private notificationContainer: HTMLElement;
        private notificationIcon: HTMLElement;
        private notification: HTMLElement;


        constructor() {
            console.info( this.NAME + " has been initiated");
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

        public registerEventInterests(): void {
            eventDispatcher.registerEventInterest( this, Notifications.LOGIN_SUCCESS );
            eventDispatcher.registerEventInterest( this, Notifications.INVITATIONS );
        }

        public registerEventListeners(): void {
            this.notificationIcon.addEventListener( "click", (e) => {
                e.stopPropagation();
                e.preventDefault();
                this.notification.classList.toggle("active");
                this.notification.classList.remove("notification-alert");
                this.notificationDropDown.style.display = this.notificationDropDown.style.display === 'none' ? 'block' : 'none';
            });

            this.notificationDropDown.addEventListener( "click", (e) => {
                e.stopPropagation();
            });

            window.addEventListener( "click", () => {
                this.notificationDropDown.style.display = "none";
                this.notification.classList.remove("active");
            });
        }

        public addInvitation(invitation: any): void {

            let inv = document.createElement("li");
            inv.id = invitation._id;
            inv.className = "notification-item grid new";

            inv.innerHTML = `<div class="g-15">
                                <div id="notification-item-monogram-${invitation._id}" class="notification-item-monogram profile-monogram inline">
                                    <ul id="notification-item-monogram-list-${invitation._id}" class="notification-item-monogram-list list-clear">
                                        <li id="notification-item-monogram-item-${invitation._id}" class="profile-item inline bg-FFE4EC">
                                            <span class="upper f-F01959 semi-bold f-12-15">ma</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="g-85">
                                <div class="notification-item-header grid poz-center">
                                    <div class="g-70">
                                        <span id="notification-item-name-${invitation._id}" class="notification-item-name capit semi-bold f-12-15 block">${invitation.inviteFrom}</span>
                                    </div>
                                    <div class="g-30 right">
                                        <div id="notification-item-ago-${invitation._id}" class="notification-item-ago upper semi-bold bg-FA3C65 rad-5 inline">
                                            <span class="upper f-8-10 f-ffffff">new</span>
                                        </div>
                                    </div>
                                </div>
                                <div id="notification-item-message-${invitation._id}" class="notification-item-message">
                                    <span id="notification-item-message-desc" class="notification-item-message-desc f-12-15">${invitation.message}</span>
                                    <span id="notification-item-message-group-name" class="notification-item-message-group-name f-12-15 f-34C197 semi-bold">${invitation.plantGroupName}</span>
                                </div>
    
                                <!-- Notification item confirmations -->
                                <div id="notification-item-confirmation-${invitation._id}" class="notification-item-confirmation g-100 block">
                                    <a id="notification-item-accept-${invitation._id}" class="notification-item-accept bg-1997F0 semi-bold f-ffffff notification-item-confirm-btn f-12-15 rad-4">Accept</a>
                                    <a id="notification-item-decline-${invitation._id}" class="notification-item-decline f-1997F0 semi-bold notification-item-confirm-btn f-12-15 rad-4">Decline</a>
                                </div>
                                <!-- END Notification item confirmations -->
                            </div>`;


            this.notificationContainer.insertBefore(inv, this.notificationContainer.firstChild);
            this.notification.classList.add("notification-alert");

            const responseContainer = document.getElementById(`notification-item-confirmation-${invitation._id}`);
            const acceptBtn = document.getElementById(`notification-item-accept-${invitation._id}`);
            const cancelBtn = document.getElementById(`notification-item-decline-${invitation._id}`);

            acceptBtn.addEventListener( "click", () => {
                responseContainer.setAttribute("style", "display:none");
            });

            cancelBtn.addEventListener( "click", () => {
                responseContainer.setAttribute("style", "display:none");
            });
        }

        public injectHTML(): void {
            this.container.innerHTML = `
                    <div id="heading-container" class="heading-container">
                        <div class="grid poz-center">
                
                            <!-- Logo -->
                            <div id="heading-logo" class="heading-logo g-10">
                                <a class="inline">
                                    <svg width="91px" height="22px" viewBox="0 0 91 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" font-family="pacificoregular" font-size="20" font-weight="normal">
                                            <g id="Sign-Up" transform="translate(-20.000000, -12.000000)">
                                                <text id="PlantCare">
                                                    <tspan x="20.48" y="31" fill="#34C197">Plant</tspan>
                                                    <tspan x="70.08" y="31" fill="#233B30">Care</tspan>
                                                </text>
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </div>
                            <!-- End Logo -->
                
                            <div class="g-90">
                                <!-- Heading Landing -->
                                <div id="heading-landing" class="heading-landing right">
                                    <ul class="list-clear">
                                        <li class="inline">
                                            <a id="heading-landing-btn-support" class="heading-landing-btn-support heading-landing-btn capit f-12-15">support</a>
                                        </li>
                                        <li class="inline">
                                            <a id="heading-landing-btn-about-us" class="heading-landing-btn-about-us heading-landing-btn capit f-12-15">about us</a>
                                        </li>
                                        <li class="inline">
                                            <a id="heading-landing-btn-sign-up" class="heading-landing-btn-sign-up heading-landing-btn capit f-12-15 rad-13-5 bg-FA3C65 f-ffffff">sign
                                                                                                                                                                                  up</a>
                                        </li>
                                    </ul>
                                </div>
                                <!-- END Heading Landing -->
                
                                <!-- Header after signed user-->
                                <div id="heading-signed" class="heading-signed" style="display: none">
                                    <div class="grid">
                                        <div class="g-70">
                                            <div class="row">
                                                <input id="header-search" class="header-search g-100 rad-4-5 f-12-15 input-icon search" type="text" placeholder="Search for anything" required>
                                            </div>
                                        </div>
                                        <div class="g-30 grid poz-center poz-right">
                
                
                                            <div id="notification" class="notification inline" >
                                                <!-- Notification bell -->
                                                <div id="notification-icon" class="notification-icon">
                                                    <svg width="13px" height="15px" viewBox="0 0 13 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                                        <g id="notification-bell" stroke-width="1">
                                                            <g id="notifications-icon-bell" class="notifications-icon-bell" transform="translate(-1152.000000, -15.000000)" fill="#233B30">
                                                                <g id="notifications" transform="translate(1152.000000, 15.000000)">
                                                                    <path id="notifications-bell-button" d="M6.38235294,15 C7.20735294,15 7.88235294,14.325 7.88235294,13.5 L4.88235294,13.5 C4.88235294,14.325 5.55735294,15 6.38235294,15 Z M11.2573529,10.5 L11.2573529,6.375 C11.2573529,4.05 9.68235294,2.175 7.50735294,1.65 L7.50735294,1.125 C7.50735294,0.525 6.98235294,0 6.38235294,0 C5.78235294,0 5.25735294,0.525 5.25735294,1.125 L5.25735294,1.65 C3.08235294,2.175 1.50735294,4.05 1.50735294,6.375 L1.50735294,10.5 L0.00735294118,12 L0.00735294118,12.75 L12.7573529,12.75 L12.7573529,12 L11.2573529,10.5 Z M9.75735294,11.25 L3.00735294,11.25 L3.00735294,6.375 C3.00735294,4.5 4.50735294,3 6.38235294,3 C8.25735294,3 9.75735294,4.5 9.75735294,6.375 L9.75735294,11.25 Z"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </svg>
                                                </div>
                                                <!-- END Notification bell -->
                
                                                <!--Notification bell - popup -->
                                                <div id="notification-pop-up" class="notification-pop-up" style="display: none">
                                                    <div id="notification-header" class="notification-header">
                                                        <span id="notification-header-desc" class="notification-header-desc upper semi-bold f-34C197 f-10-13">NOTIFICATIONS</span>
                                                    </div>
                                                    <div id="notification-container" class="notification-container">
                                                        <ul id="notification-container-box" class="notification-container-box list-clear">
                                                            
                
                                                            <!-- Notification-item -->
                                                            <li id="notification-item-XXX" class="notification-item grid">
                                                                <div class="g-15">
                                                                    <div id="notification-item-monogram-XXX" class="notification-item-monogram profile-monogram inline">
                                                                        <ul id="notification-item-monogram-list-XXX" class="notification-item-monogram-list list-clear">
                                                                            <li id="notification-item-monogram-item-XXX" class="profile-item inline bg-DEF1FF">
                                                                                <span class="upper f-1997F0 semi-bold f-12-15">lh</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="g-85">
                                                                    <div class="notification-item-header grid poz-center">
                                                                        <div class="g-70">
                                                                            <span id="notification-item-name-XXX" class="notification-item-name capit semi-bold f-12-15 block">Lawrence Hunter</span>
                                                                        </div>
                                                                        <div class="g-30 right">
                                                                            <span id="notification-item-ago-XXX" class="notification-item-ago capit semi-bold f-8-10 block f-777B79">Yesterday</span>
                                                                        </div>
                                                                    </div>
                                                                    <div id="notification-item-message-XXX" class="notification-item-message">
                                                                        <span id="notification-item-message-desc" class="notification-item-message-desc f-12-15">Watered all plants within </span>
                                                                        <span id="notification-item-message-group-name" class="notification-item-message-group-name f-12-15 f-34C197 semi-bold">Outdoor Plants</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <!-- END Notification-item -->
                
                                                            <!-- Notification-item -->
                                                            <li id="notification-item-XXX" class="notification-item grid">
                                                                <div class="g-15">
                                                                    <div id="notification-item-monogram-XXX" class="notification-item-monogram profile-monogram inline">
                                                                        <ul id="notification-item-monogram-list-XXX" class="notification-item-monogram-list list-clear">
                                                                            <li id="notification-item-monogram-item-XXX" class="profile-item inline bg-DEF1FF">
                                                                                <span class="upper f-1997F0 semi-bold f-12-15">lh</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="g-85">
                                                                    <div class="notification-item-header grid poz-center">
                                                                        <div class="g-70">
                                                                            <span id="notification-item-name-XXX" class="notification-item-name capit semi-bold f-12-15 block">Lawrence Hunter</span>
                                                                        </div>
                                                                        <div class="g-30 right">
                                                                            <span id="notification-item-ago-XXX" class="notification-item-ago capit semi-bold f-8-10 block f-777B79">2 hours ago</span>
                                                                        </div>
                                                                    </div>
                                                                    <div id="notification-item-message-XXX" class="notification-item-message">
                                                                        <span id="notification-item-message-desc" class="notification-item-message-desc f-12-15">Added 4 new plants to plant group</span>
                                                                        <span id="notification-item-message-group-name" class="notification-item-message-group-name f-12-15 f-34C197 semi-bold">Outdoor Plants</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <!-- END Notification-item -->
                
                                                            <!-- Notification-item -->
                                                            <li id="notification-item-XXX" class="notification-item grid">
                                                                <div class="g-15">
                                                                    <div id="notification-item-monogram-XXX" class="notification-item-monogram profile-monogram inline">
                                                                        <ul id="notification-item-monogram-list-XXX" class="notification-item-monogram-list list-clear">
                                                                            <li id="notification-item-monogram-item-XXX" class="profile-item inline bg-F9EBFF">
                                                                                <span class="upper f-CA53FC semi-bold f-12-15">lw</span>
                                                                            </li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                                <div class="g-85">
                                                                    <div class="notification-item-header grid poz-center">
                                                                        <div class="g-70">
                                                                            <span id="notification-item-name-XXX" class="notification-item-name capit semi-bold f-12-15 block">Luke Walton</span>
                                                                        </div>
                                                                        <div class="g-30 right">
                                                                            <span id="notification-item-ago-XXX" class="notification-item-ago capit semi-bold f-8-10 block f-777B79">9 May 2018</span>
                                                                        </div>
                                                                    </div>
                                                                    <div id="notification-item-message-XXX" class="notification-item-message">
                                                                        <span id="notification-item-message-desc" class="notification-item-message-desc f-12-15">Watered 3 plants within</span>
                                                                        <span id="notification-item-message-group-name" class="notification-item-message-group-name f-12-15 f-34C197 semi-bold">Indoor Plants</span>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                            <!-- END Notification-item -->
                                                        </ul>
                                                    </div>
                                                    <div id="notification-footer" class="notification-footer center">
                                                        <a id="notification-view-all" class="notification-view-all capit semi-bold f-34C197 f-10-13">view all</a>
                                                    </div>
                                                </div>
                                                <!--Notification bell - popup-->
                                            </div>
                
                                            <div id="profile" class="profile inline grid poz-center">
                                                <span id="user-name" class="user-name capit semi-bold inline">Katie Poole</span>
                                                <div class="profile-monogram inline">
                                                    <ul class="list-clear">
                                                        <li class="profile-item inline bg-DEF1FF">
                                                            <span class="upper f-1997F0 semi-bold f-12-15">KP</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                
                                    </div>
                                </div>
                                <!-- END Header after signed user-->
                            </div>
                        </div>
                    </div>`;
        }

        private switchHeaderContent(): void {
            this.headerLandingContent.setAttribute("style", "display:none");
            this.headerSignedInContent.setAttribute("style", "display:block");
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {
                case Notifications.LOGIN_SUCCESS :

                    console.info( "Header received login success." );
                    this.switchHeaderContent();
                    connection.pingForInvites();
                    break;

                case Notifications.INVITATIONS :

                    for (let i = 0; i < data.length; i++) {
                        this.addInvitation( data[i] );
                    }

                    break;

                default :
                    break;
            }
        }

    }
}