import {ViewController} from "./UI/ViewController";
import {NavigationMenuController} from "./controller/NavigationMenuController";
import {pagesData} from "./Data/Pages";

export class App {

    private _navigationController
    private rootVC: ViewController
    private currentVC: ViewController

    constructor(rootViewController: ViewController)
    {
        this.rootVC = rootViewController;
        this.loadVC(this.rootVC)
        rootViewController.hide(false)
    }

    private loadVC(vc: ViewController)
    {
        this.currentVC = vc
        this.currentVC.navigation = this
    }

    navigateTo(vc: ViewController, animated: boolean = true)
    {
        // TODO: make the process animated
        this.currentVC.hide(true)
        this.currentVC.deallocateAll()
        this.loadVC(vc)
        this.currentVC.hide(false)
    }

    get navigationController() {
        return this._navigationController
    }

    set navigationController(nvc) {
        this._navigationController = nvc
        this._navigationController.navigation = this
        this._navigationController.hide(false)
    }
}

