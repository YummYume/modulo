import { Controller } from "@hotwired/stimulus";
import { fr } from "date-fns/locale";

export default class extends Controller {
    connect() {
        this.element.addEventListener("chartjs:pre-connect", this._onPreConnect);
    }

    disconnect() {
        this.element.removeEventListener("chartjs:pre-connect", this._onPreConnect);
    }

    _onPreConnect(event) {
        event.detail.options.scales.x = {
            ...event.detail.options.scales.x,
            adapters: {
                date: {
                    locale: fr
                }
            }
        };
    }
}
