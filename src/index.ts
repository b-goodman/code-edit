import style from "codemirror/lib/codemirror.css";
import theme from "codemirror/theme/monokai.css";

enum Mode {
    htmlmixed = "htmlmixed",
    javascript = "javascript",
    typescript = "typescript"
}

export default class CodeEdit extends HTMLElement {

    static get observedAttributes() {
        return ["mode"];
    }

    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${style}${theme}</style>
            <textarea></textarea>
        `;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.initEditor();
    }

    public get mode(): Mode {
        return this.getAttribute("mode") as Mode || Mode.htmlmixed;
    }

    public set mode(newState: Mode) {
        this.setAttribute("mode", newState);
    }

    public initEditor(): void {
        const prevEl = this.shadowRoot!.querySelector<HTMLDivElement>("div.CodeMirror");
        console.log("prevEL",prevEl)
        if (prevEl) {
            prevEl.remove();
        };
        this.getModeDfn().import.then( async () => {
            const CodeMirror = await import("codemirror");
            const destEL = this.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea")!;
            const mode = this.getModeDfn().mode;
            CodeMirror.default.fromTextArea(destEL, {
                lineNumbers: true,
                theme: "monokai",
                mode,
            });
            console.log(mode)
        })
    }

    attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) {
        if (_name === "mode" && _oldValue !== _newValue && _oldValue !== null) {
            console.log("attr. 'mode':",_oldValue,_newValue)
            this.initEditor();
        }
    }

    private getModeDfn() {
        switch (this.mode) {
            case Mode.htmlmixed:
                return {
                    import: import("codemirror/mode/htmlmixed/htmlmixed.js"),
                    mode: {
                        name: this.mode
                    }
                };
            case Mode.javascript:
                return {
                    import: import("codemirror/mode/javascript/javascript.js"),
                    mode: {
                        name: this.mode,
                    }
                };
            case Mode.typescript:
                        return {
                            import: import("codemirror/mode/javascript/javascript.js"),
                            mode: {
                                name: Mode.javascript,
                                typescript: true,
                            }
                        };
            default:
                return {
                    import: import("codemirror/mode/htmlmixed/htmlmixed.js"),
                    mode: {
                        name: this.mode
                    }
                };
        }
    }

}

window.customElements.define('code-edit', CodeEdit);
