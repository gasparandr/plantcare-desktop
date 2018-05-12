


namespace Components {
    export class PlantGroupCard implements IComponent {
        public NAME: string = "PlantGroupCard";
        private container: HTMLElement;
        private speciesCount: number;
        private plantCount: number;
        private name: string;
        private lastWateredDate: string;
        private nextWateringDate: string;
        private percent: number;
        private statusClassName: string;


        constructor(config: any) {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.generateMockData();

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

        private generateMockData(): void {
            this.speciesCount = Math.floor(Math.random() * 9) + 4;
            this.plantCount = Math.floor(Math.random() * 22) + 6;
            const lastWateredDay = Math.floor(Math.random() * 18) + 1;
            this.lastWateredDate = lastWateredDay + " May 2018";
            const randomFreq = Math.floor(Math.random() * 12) + 1;
            this.nextWateringDate = (randomFreq + lastWateredDay) + " May 2018";
            this.percent = Math.floor(Math.random() * 100) + 1;

            if ( this.percent <= 33) {
                this.statusClassName = "";
            } else if (this.percent <= 66) {
                this.statusClassName = "";
            } else {
                this.statusClassName = "";
            }
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {

            }
        }


    }
}