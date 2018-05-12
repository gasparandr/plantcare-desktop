


namespace Components {
    export class PlantGroupCard implements IComponent {
        public NAME: string = "PlantGroupCard";
        private container: HTMLElement;
        private speciesCount: number;
        private plantCount: number;
        private lastWateredDate: string;
        private nextWateringDate: string;
        private percent: number;
        private statusClassName: string;
        private name: string;
        private id: string;
        private description: string;
        private plantGroupWateringBtn: HTMLElement;
        private confirmation: HTMLElement;
        private confirmBtnYes: HTMLElement;
        private confirmBtnNo: HTMLElement;

        private plantGroupCardLastWateringDate: HTMLElement;
        private plantGroupCardNextWateringDate: HTMLElement;
        private plantGroupCardStatus: HTMLElement;
        private plantGroupCardProgressStatus: HTMLElement;


        constructor(config: any) {
            console.info( this.NAME + " has been initiated");
            this.registerEventInterests();

            this.name = config.name;
            this.id = config._id;
            this.description = config.description;

            this.generateMockData();

            this.container = document.getElementById("plant-groups-wrapper");
            this.injectHTML();

            this.plantGroupWateringBtn = document.getElementById(`plant-group-watering-btn-${this.id}`);
            this.confirmation = document.getElementById( `plant-group-card-confirmation-${this.id}`);
            this.confirmBtnYes = document.getElementById( `confirmation-btn-yes-${this.id}` );
            this.confirmBtnNo = document.getElementById( `confirmation-btn-no-${this.id}` );

            this.plantGroupCardLastWateringDate = document.getElementById( `plant-group-card-last-watering-date-${this.id}`);
            this.plantGroupCardNextWateringDate = document.getElementById( `plant-group-card-next-watering-${this.id}` );
            this.plantGroupCardStatus = document.getElementById( `plant-group-card-status-${this.id}` );
            this.plantGroupCardProgressStatus = document.getElementById( `plant-group-card-progress-status-${this.id}` );


            this.registerEventListeners();

        }

        public registerEventInterests(): void {
        }

        public registerEventListeners(): void {
            this.plantGroupWateringBtn.addEventListener( "click", () => {
                this.plantGroupWateringBtn.style.display = "none";
                this.confirmation.classList.add("active");
            });

            this.confirmBtnNo.addEventListener( "click", () => {
                this.confirmation.classList.remove("active");
                this.plantGroupWateringBtn.style.display = "block";

            });

            this.confirmBtnYes.addEventListener( "click", () => {
                this.confirmation.classList.remove("active");
                this.plantGroupWateringBtn.style.display = "block";

                connection.waterPlantGroup( this.id );

                this.updateLastWatering();


            });
        }

        public injectHTML(): void {
            let plantGroupContainer: HTMLElement = document.createElement("div");
            plantGroupContainer.id = `plant-group-card-item-${this.id}`;
            plantGroupContainer.className = "plant-group-card-item g-33";

            plantGroupContainer.innerHTML = `<!-- Plan group card -->
                    <div id="plant-group-card-${this.id}" class="plant-group-card">
        
                        <!-- Default card content -->
                        <div class="plant-group-card-container bg-ffffff">
                            <!-- More option btn -->
                            <div id="more-option-${this.id}" class="more-option">
                                <a id="more-option-btn-${this.id}" class="more-option-btn">
                                    <svg width="4px" height="15px" viewBox="0 0 4 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-793.000000, -179.000000)" fill="#233B30" fill-rule="nonzero">
                                                <g transform="translate(510.000000, 159.000000)">
                                                    <g transform="translate(19.000000, 20.000000)">
                                                        <path d="M265.675532,3.35106383 C264.750161,3.35106383 264,2.60090264 264,1.67553191 C264,0.75016119 264.750161,0 265.675532,0 C266.600903,0 267.351064,0.75016119 267.351064,1.67553191 C267.351064,2.60090264 266.600903,3.35106383 265.675532,3.35106383 Z M265.675532,9.25531915 C264.750161,9.25531915 264,8.50515796 264,7.57978723 C264,6.65441651 264.750161,5.90425532 265.675532,5.90425532 C266.600903,5.90425532 267.351064,6.65441651 267.351064,7.57978723 C267.351064,8.50515796 266.600903,9.25531915 265.675532,9.25531915 Z M265.675532,15 C264.750161,15 264,14.2498388 264,13.3244681 C264,12.3990974 264.750161,11.6489362 265.675532,11.6489362 C266.600903,11.6489362 267.351064,12.3990974 267.351064,13.3244681 C267.351064,14.2498388 266.600903,15 265.675532,15 Z" id="more-icon"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                </a>
                            </div>
                            <!-- END More option btn -->
        
                            <span id="plant-group-card-info-${this.id}" class="plant-group-card-info f-10-13">${this.speciesCount} species | ${this.plantCount} plants</span>
        
                            <h4 id="plant-group-card-title-${this.id}" class="plant-group-card-title f-17-20">${this.name}</h4>
        
                            <!-- Members-->
                            <div id="plant-group-card-members-${this.id}" class="members">
                                <div class="profile-monogram inline">
                                    <ul id="profile-monogram-list-${this.id}" class="profile-monogram-list list-clear">
                                        <li id="profile-monogram-list-item-${this.id}" class="profile-monogram-list-item profile-item inline bg-FFE4E4">
                                            <span class="upper f-FB5858 semi-bold f-11-14">JM</span>
                                        </li>
                                        <li id="profile-monogram-list-item-XXX" class="profile-monogram-list-item profile-item inline bg-F1E5FF">
                                            <span class="upper f-A458FB semi-bold f-11-14">JM</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <!-- END Members-->
        
                            <div id="plant-group-card-summary-${this.id}" class="plant-group-card-summary">
                                <!-- Last watering time-->
                                <div id="plant-group-card-last-watering-${this.id}" class="plant-group-card-last-watering grid poz-center">
                                    <svg width="9px" height="12px" viewBox="0 0 9 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g transform="translate(-882.000000, -287.000000)" fill="#1997F0" fill-rule="nonzero">
                                                <g transform="translate(860.000000, 159.000000)">
                                                    <g transform="translate(19.000000, 20.000000)">
                                                        <g transform="translate(3.000000, 107.000000)">
                                                            <path class="icon" d="M3.83415156,1.14235432 L0.539492807,6.88823069 C-0.152845778,8.10298476 -0.206319371,9.64758706 0.539492807,10.9482727 C1.66063976,12.9035426 4.15458244,13.5797513 6.10986646,12.4585902 C8.06515049,11.3374432 8.7413592,8.84351472 7.62019808,6.88821653 L4.32553933,1.14235432 C4.21670867,0.952548559 3.94296806,0.952548559 3.83415156,1.14235432 Z" id="water-drop-blue"></path>
                                                        </g>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <span id="plant-group-card-last-watering-date-${this.id}" class="plant-group-card-last-watering-date f-10-13 semi-bold">${this.lastWateredDate}</span>
                                </div>
                                <!-- END Last watering time-->
        
                                <div class="plant-group-card-next-watering-block grid">
                                    <!-- Next watering time -->
                                    <div class="g-60">
                                        <span class="f-10-13 semi-bold">Next watering: </span>
                                        <span id="plant-group-card-next-watering-${this.id}" class="plant-group-card-next-watering f-10-13 semi-bold">${this.nextWateringDate}</span>
                                    </div>
                                    <!-- END Next watering time -->
        
                                    <!-- Watering status value -->
                                    <div class="g-40 right">
                                        <span id="plant-group-card-status-${this.id}" class="plant-group-card-status f-10-13 semi-bold">${this.percent}%</span>
                                    </div>
                                    <!-- Watering status value -->
                                </div>
        
                                <!-- Progress bar -->
                                <div class="progress-bar rad-6">
                                    <div class="progress-bar-bg"></div>
                                    <div id="plant-group-card-progress-status-${this.id}" class="plant-group-card-progress-status progress-bar-status rad-6 ${this.statusClassName}" style="width: ${this.percent}%"></div>
                                </div>
                                <!-- END Progress bar -->
        
                            </div>
        
                            <!-- Watering button -->
                            <div id="plant-group-watering-btn-${this.id}" class="plant-group-watering-btn bg-1997F0 rad-50">
                                <svg width="9px" height="12px" viewBox="0 0 9 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                        <g transform="translate(-882.000000, -287.000000)" fill="#ffffff" fill-rule="nonzero">
                                            <g transform="translate(860.000000, 159.000000)">
                                                <g transform="translate(19.000000, 20.000000)">
                                                    <g transform="translate(3.000000, 107.000000)">
                                                        <path class="icon" d="M3.83415156,1.14235432 L0.539492807,6.88823069 C-0.152845778,8.10298476 -0.206319371,9.64758706 0.539492807,10.9482727 C1.66063976,12.9035426 4.15458244,13.5797513 6.10986646,12.4585902 C8.06515049,11.3374432 8.7413592,8.84351472 7.62019808,6.88821653 L4.32553933,1.14235432 C4.21670867,0.952548559 3.94296806,0.952548559 3.83415156,1.14235432 Z" id="water-drop-blue"></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                            <!-- END Watering button -->
                        </div>
                        <!-- END Default card content -->
        
                        <!-- Confirmation watering-->
                        <div  id="plant-group-card-confirmation-${this.id}" class="plant-group-card-confirmation">
                            <div class="plant-group-card-confirmation-bg bg-1997F0"></div>
                            <div class="plant-group-card-confirmation-content f-ffffff center">
                                <div class="plant-group-card-confirmation-question">
                                    <span class="inline f-12-15">Are you sure you want to water all plants within MY</span>
                                    <span class="inline f-12-15 semi-bold">${this.name}</span>
                                    <span class="inline f-12-15">?</span>
                                </div>
                                <!-- Confirmation watering-->
                                <div class="confirmation-btns">
                                    <a id="confirmation-btn-no-${this.id}" class="confirmation-btn confirmation-btn-no f-12-15 capit rad-4">no</a>
                                    <a id="confirmation-btn-yes-${this.id}" class="confirmation-btn confirmation-btn-yes f-12-15 capit rad-4 bg-ffffff f-1997F0">yes</a>
                                </div>
                                <!-- END Confirmation watering-->
                                <a class="confirmation-review-plants capit semi-bold">Review Plants</a>
                            </div>
                        </div>
                        <!-- END Confirmation watering-->
        
                    </div>
                <!-- END Plan group card -->`;

            this.container.appendChild( plantGroupContainer );
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
                this.statusClassName = "red";
            } else if (this.percent <= 66) {
                this.statusClassName = "orange";
            } else {
                this.statusClassName = "green";
            }
        }

        private updateLastWatering(): void {
            this.plantGroupCardLastWateringDate.innerHTML = "TODAY";
            this.plantGroupCardNextWateringDate.innerHTML = "00 May 2019";
            this.plantGroupCardStatus.innerText = "100%";
            this.plantGroupCardProgressStatus.setAttribute("style", "width: 100%");
            this.plantGroupCardProgressStatus.classList.add("green")
        }

        public eventHandler(notification: string, data: any): void {
            switch (notification) {

            }
        }


    }
}