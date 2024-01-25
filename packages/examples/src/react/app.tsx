/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import { createJsonEditor, createWebSocketAndStartClient, performInit } from '../json/client/main.js';
import { editor } from 'monaco-editor';
import React, { createRef, useEffect, useMemo, useRef } from 'react';
import { buildWorkerDefinition } from 'monaco-editor-workers';
import { createUrl } from '../index.js';
buildWorkerDefinition('../../node_modules/monaco-editor-workers/dist/workers/', new URL('', window.location.href).href, false);

let init = true;

export type EditorProps = {
    defaultCode: string;
    hostname: string;
    port: number;
    path: string;
    className?: string;
}

export const ReactMonacoEditor: React.FC<EditorProps> = ({
    defaultCode,
    hostname,
    path,
    port,
    className
}) => {
    const editorRef = useRef<editor.IStandaloneCodeEditor>();
    const ref = createRef<HTMLDivElement>();
    const url = useMemo(() => createUrl(hostname, port, path), [hostname, port, path]);
    let lspWebSocket: WebSocket;

    useEffect(() => {
        const currentEditor = editorRef.current;

        if (ref.current != null) {
            const start = async () => {
                await performInit(true);
                await createJsonEditor({
                    htmlElement: ref.current!,
                    content: defaultCode
                });
                if (init) {
                    init = false;
                }
                lspWebSocket = createWebSocketAndStartClient(url);
            };
            start();

            return () => {
                currentEditor?.dispose();
            };
        }

        window.onbeforeunload = () => {
            // On page reload/exit, close web socket connection
            lspWebSocket?.close();
        };
        return () => {
            // On component unmount, close web socket connection
            lspWebSocket?.close();
        };
    }, []);

    return (
        <div
            ref={ref}
            style={{ height: '50vh' }}
            className={className}
        />
    );
};
