'use strict';

import * as net from 'net';
import {Trace} from 'vscode-jsonrpc';
import { window, workspace, commands, ExtensionContext, Uri, WorkspaceConfiguration } from 'vscode';
import { LanguageClient, LanguageClientOptions, StreamInfo } from 'vscode-languageclient/node';

let lc: LanguageClient;

// 获取配置项
function getLspConfig(): { host: string; port: number } {
    const config: WorkspaceConfiguration = workspace.getConfiguration('mydsl');
    return {
        host: config.get<string>('lsp.host', '127.0.0.1'), // 默认为 localhost
        port: config.get<number>('lsp.port', 5007)         // 默认为 5007
    };
}

export function activate(context: ExtensionContext) {
    // 从配置中获取连接信息
    const { host, port } = getLspConfig();

    let serverOptions = () => {
        return new Promise<StreamInfo>((resolve, reject) => {
            // 创建 socket 连接
            const socket = net.connect({ host, port }, () => {
                console.log(`Connected to LSP server at ${host}:${port}`);
                resolve({
                    writer: socket,
                    reader: socket
                });
            });

            // 处理连接错误
            socket.on('error', (err) => {
                console.error(`Connection to LSP server failed: ${err.message}`);
                reject(err);

                // 显示错误通知给用户
                window.showErrorMessage(
                    `无法连接到 LSP 服务器 ${host}:${port}。请确保服务器正在运行且配置正确。`,
                    "打开设置"
                ).then(selection => {
                    if (selection === "打开设置") {
                        commands.executeCommand('workbench.action.openSettings', 'mydsl.lsp');
                    }
                });
            });
        });
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: 'file', language: 'st' }],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.st')
        },
        // 添加连接错误处理
        connectionOptions: {
            maxRestartCount: 0 // 禁用自动重启
        }
    };

    // 创建语言客户端
    lc = new LanguageClient(
        'Xtext Server',
        serverOptions,
        clientOptions
    );

    // 注册命令代理
    const disposable = commands.registerCommand("mydsl.a.proxy", async () => {
        const activeEditor = window.activeTextEditor;
        if (!activeEditor || !activeEditor.document || activeEditor.document.languageId !== 'mydsl') {
            return;
        }

        if (activeEditor.document.uri instanceof Uri) {
            commands.executeCommand("mydsl.a", activeEditor.document.uri.toString());
        }
    });

    context.subscriptions.push(disposable);

    // 启用跟踪
    lc.setTrace(Trace.Verbose);

    try {
        lc.start();
    } catch (error) {
        console.error('Failed to start language client:', error);
        window.showErrorMessage(`启动语言客户端失败: ${error.message}`);
    }
}

export function deactivate(): Thenable<void> {
    if (!lc) {
        return Promise.resolve();
    }
    return lc.stop();
}