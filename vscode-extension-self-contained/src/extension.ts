'use strict';

import * as path from 'path';
import * as os from 'os';

import { Trace } from 'vscode-jsonrpc';
import { commands, window, workspace, ExtensionContext, Uri } from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions } from 'vscode-languageclient/node';

let lc: LanguageClient;

export function activate(context: ExtensionContext) {
    // use self-contained jre
    const javaHomePath = context.asAbsolutePath(path.join('src', 'custom-jre'));
    console.log(javaHomePath);

    // The server is a locally installed in src/mydsl
    let launcher = os.platform() === 'win32' ? 'mydsl-standalone.bat' : 'mydsl-standalone';
    const script = context.asAbsolutePath(path.join('src', 'mydsl', 'bin', launcher));

    let serverOptions: ServerOptions;
    if (os.platform() === 'win32') {
        serverOptions = {
            run: {
                command: "cmd.exe",
                args: ["/c", script],
                options: {
                    env: {
                        JAVA_HOME: javaHomePath
                    }
                }
            },
            debug: {
                command: "cmd.exe",
                args: ["/c", script],
                options: {
                    env: createDebugEnv()
                }
            }
        };
    } else {
        serverOptions = {
            run: {
                command: script,
                args: [],
                options: {
                    env: {
                        JAVA_HOME: javaHomePath
                    }
                }
            },
            debug: {
                command: script,
                args: [],
                options: {
                    env: createDebugEnv()
                }
            }
        };
    }

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'st' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.st')
        }
    };

    // Create the language client and start the client.
    lc = new LanguageClient('Xtext Server', serverOptions, clientOptions);

    var disposable2 = commands.registerCommand("mydsl.a.proxy", async () => {
        let activeEditor = window.activeTextEditor;
        if (!activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'st') {
            return;
        }

        if (activeEditor.document.uri instanceof Uri) {
            commands.executeCommand("mydsl.a", activeEditor.document.uri.toString());
        }
    })
    context.subscriptions.push(disposable2);

    // enable tracing (.Off, .Messages, Verbose)
    lc.setTrace(Trace.Verbose);
    lc.start();
}

export function deactivate() {
    return lc.stop();
}

function createEnv() {
    return Object.assign({
        JAVA_OPTS: "-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y"
    }, process.env)
}

function createDebugEnv() {
    return Object.assign({
        JAVA_OPTS: "-Xdebug -Xrunjdwp:server=y,transport=dt_socket,address=8000,suspend=n,quiet=y"
    }, process.env)
}