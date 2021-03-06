import style from "codemirror/lib/codemirror.css";
import theme from "codemirror/theme/monokai.css";
import base from "./index.scss";

enum Mode {
    htmlmixed = "htmlmixed",
    javascript = "javascript",
    typescript = "typescript",
    markdown = "markdown",
}

export default class CodeEdit extends HTMLElement {

    static get observedAttributes() {
        return ["mode"];
    }

    public editor?: CodeMirror.EditorFromTextArea;


    constructor() {
        super();

        const template = document.createElement('template');
        template.innerHTML = `
            <style>${style}${theme}${base}</style>
            <textarea></textarea>
        `;

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(template.content.cloneNode(true));
    }

    async connectedCallback() {
        this.editor = await this.initEditor();
    }

    public get mode(): Mode {
        return this.getAttribute("mode") as Mode || Mode.htmlmixed;
    }

    public set mode(newState: Mode) {
        this.setAttribute("mode", newState);
    }

    public get storageKey() {
        return this.getAttribute("storage-key") || undefined;
    }

    public initEditor(): Promise<CodeMirror.EditorFromTextArea> {
        const prevEl = this.shadowRoot!.querySelector<HTMLDivElement>("div.CodeMirror");
        if (prevEl) {
            prevEl.remove();
        };
        if (this.editor) {
            this.editor.off("change", this.saveSessionInput)
        };
        return new Promise( (resolve) => {
            this.getModeDfn().import.then( async () => {
                const CodeMirror = await import("codemirror");
                const destEL = this.shadowRoot!.querySelector<HTMLTextAreaElement>("textarea")!;
                const mode = this.getModeDfn().mode;
                const editor = CodeMirror.default.fromTextArea(destEL, {
                    lineNumbers: true,
                    theme: "monokai",
                    mode,
                });
                const initialState = this.loadSessionInputData();
                if (initialState) {
                    this.setValue(initialState);
                };
                if (this.storageKey) {
                    editor.on("change", this.saveSessionInput)
                }
                resolve(editor);
            });
        })
    }

    public async getValue(seperator?: string): Promise<string> {
        if (this.editor) {
            return this.editor.getValue(seperator)
        } else {
            this.editor = await this.initEditor();
            return this.editor.getValue(seperator);
        }
    }

    public async setValue(code: string): Promise<void> {
        if (this.editor) {
            return this.editor.setValue(code)
        } else {
            this.editor = await this.initEditor();
            return this.editor.setValue(code);
        }
    }

    async attributeChangedCallback(_name: string, _oldValue: string, _newValue: string) {
        if (_name === "mode" && _oldValue !== _newValue && _oldValue !== null) {
            this.editor = await this.initEditor();
        }
    }

    private loadSessionInputData() {
        return this.storageKey
            ? window.localStorage.getItem(`${window.location.href}-${this.storageKey}`) || undefined
            : undefined
    }

    private saveSessionInput = async (_instance: CodeMirror.Editor, _changes: CodeMirror.EditorChangeLinkedList) => {
        const input = await this.getValue();
        window.localStorage.setItem(`${window.location.href}-${this.storageKey}`, input);
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
            case Mode.markdown:
                return {
                    import: import("codemirror/mode/markdown/markdown.js"),
                    mode: {
                        name: Mode.markdown,
                        highlightFormatting: true,
                    }
                }
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
