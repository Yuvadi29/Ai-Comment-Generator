// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { buildPrompt } from './promptBuilder';
import { generateComment } from './ollama';
import { addCommentToFile, getCurrentLine } from './manageEditor';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "commentgenerator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const generateCommentCommand = vscode.commands.registerCommand('commentgenerator.generateComment', async () => {
		vscode.window.showInformationMessage('Generating comment, please wait!!');

		const editor = vscode.window.activeTextEditor;
		if (editor === undefined) {
			vscode.window.showErrorMessage('Failed to retrieve editor');
			return;
		}

		const prompt = await buildPrompt(editor);
		console.log('prompt', prompt);

		if (prompt === undefined) {
			vscode.window.showErrorMessage('Failed to generate prompt');
			return;
		}

		const comment = await generateComment(prompt);
		console.log('generated comment: ', comment);

		if (comment === undefined) {
			vscode.window.showErrorMessage('Failed to generate comment');
			return;
		}

		const fileURI = editor.document.uri;
		const fileName = editor.document.fileName;
		const currentLine = getCurrentLine(editor);

		addCommentToFile(fileURI, fileName, currentLine, comment);
	});


	context.subscriptions.push(generateCommentCommand);


}

// This method is called when your extension is deactivated
export function deactivate() { }
