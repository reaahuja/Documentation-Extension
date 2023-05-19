// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { rejects } from 'assert';
import { error } from 'console';
import { resolve } from 'path';
import * as vscode from 'vscode';
const axios = require("axios");
//initiate file with OPENAI API Key
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, '/Users/reaahuja/Documents/Javascript-learning/documentationext/src/.env') });


function getLanguage():any {
	return new Promise((resolve, reject) => {
	  let lang = vscode.window.activeTextEditor?.document.languageId;

	
	  resolve(lang);
	  
	  
	});
}
  

// //async function httpRequest(language: string | undefined): Promise<string> {
// 	return new Promise(async (resolve, reject) => {
// 	  const apiKey = "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";
  
// 	  const client = axios.create({
// 		headers: {
// 		  Authorization: 'Bearer ' + apiKey,
// 		},
// 	  });
  
// 	  const parameters = {
// 		model: "gpt-3.5-turbo",
// 		messages: [{ role: "user", content: `ONLY link to documentation for the language: ${language} with no other message` }],
// 	  };
  
// 	  //const result = await axios.post("https://api.openai.com/v1/chat/completions", parameters);
// 	  client
// 		 .post("https://api.openai.com/v1/chat/completions", parameters)
// 		.then((result: any) => {
// 		  resolve(result.data.choices[0].text);
// 		})
// 		.catch((err: any) => {
// 		  reject(err);
// 		});
// 	});
//  // }

 async function httpRequest(language: string | undefined){
	//vscode.window.showInformationMessage("API Key: " +  process.env.OPENAI_API_KEY);
	const { Configuration, OpenAIApi } = require("openai");

	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	});
	const openai = new OpenAIApi(configuration);

	const completion = await openai.createChatCompletion({
	model: "gpt-3.5-turbo",
	messages: [{role: "user", content: `give link to the documentation for the language: ${language}, and nothing else`}],
	});
	//vscode.window.showInformationMessage("Info here: " + completion.data.choices[0].message.content);
	return completion.data.choices[0].message.content;

 }
  

function coreFunction() {
	return new Promise((resolve, reject) => {
	  let language: string | undefined;
  
	  // Retrieve Language of Program 
	  getLanguage()
		.then((result: any) => {
		  language = result;
		  // Send HTTP request to chatGPT
		  vscode.window.showInformationMessage('Language used:' + language);	
		})
		.then((result: any) =>{
			vscode.window.showInformationMessage("Retrieving documentation...");	
		
		   let value = httpRequest(language);
		   //let retain = JSON.stringify(value);
		   //vscode.window.showInformationMessage("Info:" + retain);	
		   return value;
		})
		.then((response: unknown) => {
		  resolve(response);
		})
		.catch((error: any) => {
		  reject(error);
		});
	});
  }
  

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	//console.log('Congratulations, your extension "documentationext" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json

	//Start on Command: Find Documentation 
	let disposable = vscode.commands.registerCommand('documentationext.documentation', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user


		coreFunction()
			.then((response: any) => {
				vscode.window.showInformationMessage('Link to Documentation: ' + response);	
			})
			.catch((error: any) => {
				vscode.window.showInformationMessage('Error:' + error);	
			});
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
function then(arg0: () => void) {
	throw new Error('Function not implemented.');
}

