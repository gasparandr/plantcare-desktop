

namespace Core {

    export class Proxy implements IProxy{
        public NAME: string = "Proxy";
        private address: string;
        private userId: string;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.address = "";
        }


        public login(email: string, password: string): void {

        }

        public getPlants(plantGroupId: string): void {

        }

        public getPlantGroups(): void {

        }

        public invite(): void {

        }

        public getInvites(): void {

        }

        public waterPlant(plantId: string): void {

        }

        public waterPlantGroup(plantGroupId: string): void {

        }

        public pingForInvites(): void {

        }

        public cancelPing(): void {

        }

    }


}