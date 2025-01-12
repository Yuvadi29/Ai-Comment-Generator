import * as vscode from 'vscode';

// Accepts current text editor as argument and returns entire text of currently focused file, providing relevant code context
function getScriptContext(editor: vscode.TextEditor) {
    let document = editor.document;
    const codeContext = document.getText();
    return codeContext;
}


// Reads text from clipboard and returns it as the code block
async function getCodeBlock() {
    const codeBlock = await vscode.env.clipboard.readText().then((text) => {
        return text;
    });

    return codeBlock;
}

// Takes the current text editor as an argument and returns the appropriate comment syntax for the file extension.
function selectCommentSyntax(editor: vscode.TextEditor): string {
    const fileExtension = editor.document.fileName.toLowerCase().split('.').at(-1);

    // Mapping of file extensions to comment syntax
    const commentSyntaxMap: Record<string, string> = {
        js: '//',
        jsx: '{/**/}',
        tsx: '{/**/}',
        ts: '//',
        py: '#',
        java: '//',
        cpp: '//',
        c: '//',
        cs: '//',
        html: '<!-- -->',
        css: '/* */',
        php: '//',
        rb: '#',
        swift: '//',
        go: '//',
        rs: '//',
        kt: '//',
        scala: '//',
        sh: '#',
        pl: '#',
        sql: '--',
        xml: '<!-- -->',
        json: '//',
        yaml: '#',
        yml: '#',
        md: '<!-- -->',
        txt: '#', // Defaulting to '#' for text files
    };

    // Default comment syntax if the extension is not found
    const defaultSyntax = '//';

    return commentSyntaxMap[fileExtension!] || defaultSyntax;
}

// This code defines a function named buildPrompt, which takes the current text editor as an argument and returns the prompt string.

// It first retrieves the code block, code context, and comment syntax using the previously defined functions. Then, it constructs the prompt string using template literals and replaces the placeholders with the actual values.
export async function buildPrompt(editor: vscode.TextEditor) {
    const codeBlock = await getCodeBlock();
    const codeContext = getScriptContext(editor);
    const commentSyntax = selectCommentSyntax(editor);

    if (codeBlock === undefined || codeContext === undefined) {
        return;
    }

    let prompt = `
    complete code:
    "
    {CONTEXT}
    "

    Given the code block below, write a brief, insightful comment that explains its purpose and functionality within the script. If applicatble, mention any inputs expected in the code block.
    Keep the comment concise (maximum 2 lines). Wrap the comment with the appropriate comment syntax ({COMMENT-SYNTAX}). Avoid assumptions about the complete code and focus on the provided block. Don't rewrite the code block.

    code block:
    "
    {CODE-BLOCK}
    "
    `;

    prompt = prompt
        .replace('{CONTEXT}', codeContext)
        .replace('{CODE-BLOCK}', codeBlock)
        .replace('{COMMENT-SYNTAX}', commentSyntax);

    return prompt;
}