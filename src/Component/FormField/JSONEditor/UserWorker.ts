// import { loader } from '@monaco-editor/react';

// import * as monaco from 'monaco-editor';
// // import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
// // import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
// // import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
// // import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
// // import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

// // @ts-ignore
// self.MonacoEnvironment = {
//   getWorker: function (moduleId, label) {
//     if (label === 'json') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
//     }
//     if (label === 'css' || label === 'scss' || label === 'less') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
//     }
//     if (label === 'html' || label === 'handlebars' || label === 'razor') {
//       return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
//     }
//     if (label === 'typescript' || label === 'javascript') {
//       return new Worker(
//         new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url),
//       );
//     }
//     return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
//   }
// };

// loader.config({ monaco });
// loader.init();
