/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2024 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReactMonacoEditor } from './app.js';

export const startReactJsonClient = () => {
    const defaultCode = `<script>
let name = 'world';
</script>

<h1>Hello {name}!</h1>`;

    const root = ReactDOM.createRoot(document.getElementById('root')!);
    root.render(<ReactMonacoEditor
        defaultCode={defaultCode}
        hostname={'localhost'}
        path={'/svelte'}
        port={3000} />);
};
