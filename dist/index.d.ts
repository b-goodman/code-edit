/// <reference types="codemirror" />
declare enum Mode {
    htmlmixed = "htmlmixed",
    javascript = "javascript",
    typescript = "typescript",
    markdown = "markdown"
}
declare class CodeEdit extends HTMLElement {
    static get observedAttributes(): string[];
    editor?: CodeMirror.EditorFromTextArea;
    constructor();
    connectedCallback(): Promise<void>;
    get mode(): Mode;
    set mode(newState: Mode);
    get storageKey(): string | undefined;
    initEditor(): Promise<CodeMirror.EditorFromTextArea>;
    getValue(seperator?: string): Promise<string>;
    setValue(code: string): Promise<void>;
    attributeChangedCallback(_name: string, _oldValue: string, _newValue: string): Promise<void>;
    private loadSessionInputData;
    private saveSessionInput;
    private getModeDfn;
}

export default CodeEdit;
