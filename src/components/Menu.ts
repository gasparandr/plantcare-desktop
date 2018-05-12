


namespace Components {

    export class Menu implements IComponent {
        public NAME: string = "Menu";
        private container: HTMLElement;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();


            this.container = document.getElementById("heading");

            this.injectHTML();

            // initiate html elements


            this.registerEventListeners();

        }

        public registerEventInterests(): void {
        }

        public registerEventListeners(): void {
        }

        public injectHTML(): void {
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {

            }
        }

    }


}