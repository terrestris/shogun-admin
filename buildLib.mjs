#!/usr/bin/env node

import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const tsconfigPath = path.join(rootDir, 'tsconfig.build.json');

// Step 1: Compile TypeScript using the compiler API
console.log('Compiling TypeScript…');

const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

if (configFile.error) {
  logDiagnostic(configFile.error);
  process.exit(1);
}

const parsedConfig = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  rootDir
);

if (parsedConfig.errors.length > 0) {
  parsedConfig.errors.forEach(logDiagnostic);
  process.exit(1);
}

const program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
const emitResult = program.emit();

const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

diagnostics.forEach(logDiagnostic);

if (emitResult.emitSkipped || diagnostics.some(d => d.category === ts.DiagnosticCategory.Error)) {
  console.error('TypeScript compilation failed.');
  process.exit(1);
}

console.log('TypeScript compilation succeeded.');

// Step 2: Copy .less files from src/ to dist/ preserving directory structure
console.log('Copying Less files…');
copyLessFiles(srcDir);
console.log('Done.');

function copyLessFiles(currentDir) {
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      copyLessFiles(srcPath);
    } else if (entry.isFile() && entry.name.endsWith('.less')) {
      const relativePath = path.relative(srcDir, srcPath);
      const destPath = path.join(distDir, relativePath);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.copyFileSync(srcPath, destPath);
      console.log(`  Copied: ${relativePath}`);
    }
  }
}

function logDiagnostic(diagnostic) {
  if (diagnostic.file && diagnostic.start !== undefined) {
    const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
    const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
    console.error(`${diagnostic.file.fileName}:${line + 1}:${character + 1} - error TS${diagnostic.code}: ${message}`);
  } else {
    console.error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
  }
}
