


namespace Components {


    export class SubMenu implements IComponent {
        public NAME: string = "SubMenu";
        private container: HTMLElement;


        constructor() {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.container = document.getElementById("heading");

            this.injectHTML();


            this.registerEventListeners();

        }


        public injectHTML(): void {



        }

        public registerEventInterests(): void {
        }

        public registerEventListeners(): void {
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {

            }
        }


    }

}