

namespace Core {

    import Notifications = Constants.Notifications;

    export class Proxy implements IProxy{
        public NAME: string = "Proxy";
        private address: string;
        private userId: string;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.address = "";
        }


        public login(email: string, password: string): void {
            const self = this;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', this.address + "/login", true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                self.userId = response.userId;

                console.log(response);

                if ( response.success ) {
                    console.log( "LOGIN SUCCESS" );
                    eventDispatcher.sendNotification( Notifications.LOGIN_SUCCESS, response )
                } else {
                    console.log("LOGIN FAILURE! " + response.message);
                }

            };

            xhr.send(JSON.stringify({ email: email, password: password }));
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