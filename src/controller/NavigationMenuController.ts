import {ViewController} from "../UI/ViewController";
import {MenuButton} from "../components/svg/MenuButton";
import {Page} from "../data/Pages";
import {MenuItemButton} from "../components/MenuItemButton";
import {HomeController} from "./HomeController";
import {Component} from "../UI/Component";

export class NavigationMenuController extends ViewController {

    menuButton: MenuButton
    menuContent: Component
    showMenu = false

    constructor(pages: Page[])
    {
        super('menu');
        this.menuButton = new MenuButton(this.showMenu)
        this.dom.add(this.menuButton)

        this.menuContent = new Component('menu-content')
        this.menuButton.assignClass('fixed m-4')

        for (const page of pages)
        {
            const menuItemBtn = new MenuItemButton(page.name)
            this.menuContent.add(menuItemBtn)
            menuItemBtn.on('click', () => {
                this.navigation.navigateTo(page.targetController())
                this.toggleMenu()
            })
        }

        this.menuButton.on('click', () => {
            this.toggleMenu()
        })

        this.menuContent.hide(!this.showMenu)
    }

    toggleMenu = () => {
        this.showMenu = !this.showMenu
        this.menuButton.update(this.showMenu)
        this.menuContent.toggleClass('hidden', !this.showMenu)
    }
}