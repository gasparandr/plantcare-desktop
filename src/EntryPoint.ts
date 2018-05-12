///<reference path="core/Observer.ts"/>
///<reference path="core/Proxy.ts"/>
///<reference path="core/ViewManager.ts"/>


import Observer = Core.Observer;
import Proxy = Core.Proxy;
import ViewManager = Core.ViewManager;


console.info("Initiating PlantCare core components");



const eventDispatcher = new Observer();
const connection = new Proxy();
const viewManager = new ViewManager();


