

namespace Core {

    export interface IProxy {
        NAME: string;
        login(email: string, password: string): void;
        getPlants(plantGroupId: string): void;
        getPlantGroups(): void;
        invite(): void;
        getInvites(): void;
        waterPlant(plantId: string): void;
        waterPlantGroup(plantGroupId: string): void;
        pingForInvites(): void;
        cancelPing(): void;
    }




}