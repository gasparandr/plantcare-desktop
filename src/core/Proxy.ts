///<reference path="../constants/Notifications.ts"/>
///<reference path="IProxy.ts"/>


namespace Core {

    import Notifications = Constants.Notifications;

    export class Proxy implements IProxy{
        public NAME: string = "Proxy";
        private readonly address: string;
        private userId: string;
        private readonly pingDelay: number;
        private ping: any;
        private name: string;
        private invitations: Array<any>;

        constructor() {
            console.info( this.NAME + " has been initiated");
            this.address = "http://10.10.0.42:1337";
            this.pingDelay = 2000;
            this.invitations = [];
        }


        public login(email: string, password: string): void {
            const self = this;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', this.address + "/login", true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                self.userId = response.userId;
                self.name = response.name;

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
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/plant-group/plants/" + plantGroupId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                console.log(response);

                eventDispatcher.sendNotification( Notifications.PLANTS_ARRIVED, response )
            };

            xhr.send();
        }

        public getPlantGroups(): void {
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/plant-groups/" + this.userId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                console.log(response);

                eventDispatcher.sendNotification( Notifications.PLANT_GROUPS, response )
            };

            xhr.send();
        }

        public invite(plantGroupId: string): void {

        }

        public getInvitations(): void {
            const self = this;
            let xhr = new XMLHttpRequest();
            xhr.open('GET', this.address + "/invitations/" + this.userId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                console.log(response);

                console.log("invitations length:" + self.invitations.length);
                console.log("response length:" + response.length);

                if ( self.invitations.length !== response.length ) {
                    self.invitations = response;
                    eventDispatcher.sendNotification( Notifications.INVITATIONS, response )
                }


            };

            xhr.send();
        }

        public waterPlant(plantId: string): void {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', this.address + "/plant/water/" + plantId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                console.log(response);

                eventDispatcher.sendNotification( Notifications.PLANT_WATER_SUCCESS, response )
            };

            xhr.send();
        }

        public waterPlantGroup(plantGroupId: string): void {
            let xhr = new XMLHttpRequest();
            xhr.open('PUT', this.address + "/plant-group/water/" + plantGroupId, true);
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.onload = function () {

                let response = JSON.parse( this.responseText );

                console.log(response);

                eventDispatcher.sendNotification( Notifications.PLANT_GROUP_WATER_SUCCESS, response )
            };

            xhr.send();
        }

        public pingForInvites(): void {
            console.info("Ping for invites started");
            const self = this;

            this.ping = setInterval( function () {

                console.info( "Connection pinging for invitations every " + self.pingDelay + " ms" );

                let xhr = new XMLHttpRequest();
                xhr.open('GET', self.address + "/invitations/" + self.userId, true);
                xhr.setRequestHeader('Content-type', 'application/json');
                xhr.onload = function () {

                    let response = JSON.parse( this.responseText );

                    console.log(response);

                    if ( self.invitations.length !== response.length ) {
                        self.invitations = response;
                        eventDispatcher.sendNotification( Notifications.INVITATIONS, response )
                    }
                };

                xhr.send();
            }, self.pingDelay );
        }

        public cancelPing(): void {
            clearInterval( this.ping );
        }

    }


}