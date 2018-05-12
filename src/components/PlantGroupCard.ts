


namespace Components {
    export class PlantGroupCard implements IComponent {
        public NAME: string;
        private container: HTMLElement;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.container = document.getElementById("container");

            // grab html


            this.registerEventListeners();

        }

        public registerEventInterests(): void {
        }

        public registerEventListeners(): void {
        }

        public injectHTML(): void {
        }

        public eventHandler(notification: string, data: any): void {
        }


    }
}