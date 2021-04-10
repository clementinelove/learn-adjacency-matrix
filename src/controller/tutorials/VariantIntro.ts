import {ContentReader} from "./ContentReader";
import {SlideProgressDelegate} from "../../components/SlideProgressBar";

export class VariantIntro extends ContentReader implements SlideProgressDelegate {
    text: ((self) => string[])[];

    playSlide(i): void
    {

    }
}