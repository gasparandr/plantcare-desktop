///<reference path="core/Observer.ts"/>
///<reference path="core/Proxy.ts"/>
///<reference path="core/ViewManager.ts"/>


import Observer = Core.Observer;
import Proxy = Core.Proxy;
import ViewManager = Core.ViewManager;

namespace EntryPoint {
    console.info("Initiating plantcare core components");



    const eventDispatcher = new Observer();
    const connection = new Proxy();
    const viewManager = new ViewManager();
}


