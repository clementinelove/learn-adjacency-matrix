import {TitledButton} from "./TitledButton";

export class MenuItemButton extends TitledButton {

    constructor(title: string)
    {
        super(title);
        this.button
            .classed("pl-2.5 pr-2.5 pt-1 pb-1 bg-white rounded-md block text-sm hover:bg-gray-100", true)
    }
}