import {ViewController} from "../UI/ViewController";
import {MenuButton} from "../components/svg/MenuButton";
import {Page} from "../data/Pages";
import {MenuItemButton} from "../components/MenuItemButton";
import {StackView} from "../UI/StackView";
import {LayoutConstraint} from "../UI/LayoutConstraint";
import Axis = LayoutConstraint.Axis;
import Alignment = StackView.Alignment;
import * as d3 from "d3";

export class NavigationMenuController extends ViewController {

    menuButton: MenuButton
    menu: StackView

    showMenu = false

    constructor(pages: Page[])
    {
        super('menu');

        this.initializeUI()

        for (const page of pages)
        {
            const menuItemBtn = new MenuItemButton(page.name)
            menuItemBtn.assignClass('w-full font-roboto')
            this.menu.add(menuItemBtn)
            menuItemBtn.on('click', () => {
                this.navigation.navigateTo(page.targetController())
                this.toggleMenu()
            })
        }

        this.menuButton.on('click', () => {
            this.toggleMenu()
        })

        this.menu.hide(!this.showMenu)
    }

    initializeUI()
    {
        const menuButton = this.allocate(new MenuButton(this.showMenu))
        menuButton.assignClass('fixed m-4 z-100')
        this.menuButton = menuButton


        const menu = this.allocate(new StackView())
        menu.axis = Axis.Vertical
        menu.alignment = Alignment.Leading
        menu.assignClass('pt-20 fixed inset-0 shadow-md h-full w-full bg-white bg-opacity-80')
        this.menu = menu
        this.view.addAll(menu, menuButton)
    }

    toggleMenu = () => {
        this.showMenu = !this.showMenu
        this.menuButton.update(this.showMenu)
        this.menu.toggleClass('hidden', !this.showMenu)
        d3.select('#app').style('pointer-events', this.showMenu ? 'none' : 'auto')
    }
}