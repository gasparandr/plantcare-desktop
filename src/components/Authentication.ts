///<reference path="IComponent.ts"/>


namespace Components {

    export class Authentication implements IComponent{
        public NAME: string = "Authentication";
        private container: HTMLElement;
        private authContainer: HTMLElement;
        /** Login section */
        private loginContainer: HTMLElement;
        private loginMenuItem: HTMLElement;
        private loginEmailInput: HTMLInputElement;
        private loginPasswordInput: HTMLInputElement;
        private loginBtn: HTMLElement;
        /** SignUp section */
        private signUpContainer: HTMLElement;
        private signUpMenuItem: HTMLElement;
        private signUpNameInput: HTMLInputElement;
        private signUpEmailInput: HTMLInputElement;
        private signUpPasswordInput: HTMLInputElement;
        private signUpBtn: HTMLElement;


        constructor() {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.container = document.getElementById("container");

            this.injectHTML();
            this.authContainer = document.getElementById("authentification");

            this.loginContainer = document.getElementById("authentification-log-in");
            this.loginMenuItem = document.getElementById("authentification-log-in-btn");
            this.loginEmailInput = document.getElementById("authentification-log-in-email") as HTMLInputElement;
            this.loginPasswordInput = document.getElementById("authentification-log-in-password") as HTMLInputElement;
            this.loginBtn = document.getElementById("authentification-log-in-submit");

            this.signUpContainer = document.getElementById("authentification-sign-up");
            this.signUpMenuItem = document.getElementById("authentification-sign-up-btn");
            this.signUpNameInput = document.getElementById("authentification-sign-up-name") as HTMLInputElement;
            this.signUpEmailInput = document.getElementById("authentification-sign-up-email") as HTMLInputElement;
            this.signUpPasswordInput = document.getElementById("authentification-sign-up-password") as HTMLInputElement;
            this.signUpBtn = document.getElementById("authentification-sign-up-submit");


            this.registerEventListeners();
        }


        public registerEventInterests(): void {

        }

        public registerEventListeners(): void {
            this.loginMenuItem.addEventListener( "click", () => {
                this.signUpContainer.setAttribute("style", "display: none");
                this.loginContainer.setAttribute("style", "display: block");
                this.signUpMenuItem.classList.remove("active");
                this.loginMenuItem.classList.add("active");
            });

            this.signUpMenuItem.addEventListener( "click", () => {
                this.loginContainer.setAttribute("style", "display: none");
                this.signUpContainer.setAttribute("style", "display: block");
                this.loginMenuItem.classList.remove("active");
                this.signUpMenuItem.classList.add("active");

            });

            this.loginBtn.addEventListener( "click", () => {
                const email = this.loginEmailInput.value;
                const password = this.loginPasswordInput.value;

                if ( ! email || ! password ) {
                    console.warn( "Please provide an email and a password" );
                    return;
                }

                connection.login( email, password );
            });
        }

        public injectHTML() {
            this.container.innerHTML = `<!-- Authentification component -->
                    <div id="authentification" class="authentification center rad-15">
                        <!-- Authentification component - Header -->
                        <div id="authentification-header" class="authentification-header">
                            <div id="authentification-header-container" class="authentification-header-container">
                                <ul class="list-clear">
                                    <li class="authentification-header-item inline f-10-13">
                                        <a id="authentification-log-in-btn" class="authentification-log-in-btn authentification-btn capit active">log in</a>
                                    </li>
                                    <li class="authentification-header-item inline f-10-13">
                                        <a id="authentification-sign-up-btn" class="authentification-sign-up-btn authentification-btn capit">sign up</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- END Authentification component - Header -->
                    
                        <!-- Authentification component - Container -->
                        <div id="authentification-container" class="authentification-container">
                            <!-- Authentification component - Container - Log In -->
                            <div id="authentification-log-in" class="authentification-log-in authentification-content">
                                <div id="authentification-wrapper" class="authentification-wrapper">
                                    <h3 class="authentification-title f-12-15 semi-bold">Welcome Back!</h3>
                                    <p class="f-9-13 f-777B79 desc">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>
                                    <div class="form">
                                        <div class="row">
                                            <input id="authentification-log-in-email" class="authentification-log-in-email g-100 rad-4-5 f-12-15 input-icon email" type="text" placeholder="email" required>
                                        </div>
                                        <div class="row">
                                            <input id="authentification-log-in-password" class="authentification-log-in-password g-100 rad-4-5 f-12-15 input-icon password" type="password" placeholder="password" required>
                                        </div>
                                        <div class="row">
                                            <div class="grid poz-center">
                                                <div class="g-60 left grid poz-center">
                                                    <div class="checkbox">
                                                        <input id="authentification-log-in-remember-me" type="checkbox" class="checkbox" />
                                                        <label class="rad-4-5 checkbox-mark" for="checkbox"></label>
                                                        <span class="f-12-15 inline label-desc semi-bold">Remember me</span>
                                                    </div>
                                                </div>
                                                <div class="g-40 right ">
                                                    <a id="authentification-log-in-forgot-password" class="authentification-log-in-forgot-password f-9-11 f-34C197">Forgot Password?</a>
                                                </div>
                                            </div>
                                        </div>
                                        <button id="authentification-log-in-submit" class="authentification-log-in-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold">log in</button>
                                    </div>
                                </div>
                                <div class="social-desc">
                                    <span class="f-777B79 f-9-13 inline">or log in with Facebook, Twitter or Google</span>
                                </div>
                            </div>
                            <!-- END Authentification component - Container - Log In -->
                    
                            <!-- Authentification component - Container - Sign up -->
                            <div id="authentification-sign-up" class="authentification-sign-up authentification-content" style="display: none;">
                                <div class="authentification-wrapper">
                                    <h3 class="authentification-title f-12-15 semi-bold">Create Your Account!</h3>
                                    <p class="f-9-13 f-777B79 desc">Arcu aptent placerat blandit quis, lectus sit orci nec ut. Eleifend ut mauris</p>
                                    <div class="form">
                                        <div class="row">
                                            <input id="authentification-sign-up-name" class="authentification-sign-up-name g-100 rad-4-5 f-12-15 input-icon name" type="text" placeholder="name" required>
                                        </div>
                                        <div class="row">
                                            <input id="authentification-sign-up-email" class="authentification-sign-up-email g-100 rad-4-5 f-12-15 input-icon email" type="email" placeholder="email" required>
                                        </div>
                                        <div class="row">
                                            <input id="authentification-sign-up-password" class="authentification-sign-up-password g-100 rad-4-5 f-12-15 input-icon password" type="password" placeholder="password" required>
                                        </div>
                                        <button id="authentification-sign-up-submit" class="authentification-sign-up-submit authentification-submit-btn rad-4-5 g-100 bg-67E6CF-2D9DA1 f-ffffff capit semi-bold">sign up</button>
                                    </div>
                                </div>
                                <div class="social-desc">
                                    <span class="f-777B79 f-9-13 inline">or sign up with Facebook, Twitter or Google</span>
                                </div>
                            </div>
                            <!-- END Authentification component - Container - Sign up -->
                        </div>
                        <!-- END  Authentification component - Container -->
                    
                        <!-- Authentification component - Footer -->
                        <div class="authentification-footer">
                            <div class="authentification-footer-container">
                                <!-- Authentification component - Footer - Social Media -->
                                <div id="authentification-footer-social-media" class="authentification-footer-social-media inline">
                                    <ul class="list-clear">
                                        <li class="inline facebook">
                                            <a id="authentification-social-media-footer" class="authentification-social-media-footer rad-18">
                                                <img src="../_bin/icons/icon-facebook.svg" alt="">
                                            </a>
                                        </li>
                                        <li class="inline twitter">
                                            <a id="authentification-social-media-twitter" class="authentification-social-media-twitter rad-18">
                                                <img src="../_bin/icons/icon-twitter.svg" alt="">
                                            </a>
                                        </li>
                                        <li class="inline google">
                                            <a id="authentification-social-media-google" class="authentification-social-media-google rad-18">
                                                <img src="../_bin/icons/icon-google.svg" alt="">
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <!-- END Authentification component - Footer - Social Media -->
                            </div>
                        </div>
                        <!-- END Authentification component - Footer -->
                    
                    </div>
                    <!-- END Authentification component -->`;
        }

        public eventHandler(notification: string, data: any): void {

        }



    }

}