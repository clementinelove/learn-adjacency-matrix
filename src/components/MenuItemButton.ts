import {TitledButton} from "./TitledButton";

export class MenuItemButton extends TitledButton {

    constructor(title: string)
    {
        super(title);
        this.button
            .classed("px-4 pt-4 pb-2.5 hover:bg-opacity-75 block hover:bg-gray-100 " +
                         "text-2xl text-left w-full font-comfortaa", true)
    }
}