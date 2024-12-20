const fs = require('fs');
const path = require('path');

const dir = './dist';

function addJsExtension(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const updatedContent = content.replace(
        /from\s+(['"])(\..*?)(?<!\.js)\1/g,
        (match, quote, pathWithoutExtension) => `from ${quote}${pathWithoutExtension}.js${quote}`
    );

    fs.writeFileSync(filePath, updatedContent, 'utf-8');
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.js')) {
            addJsExtension(fullPath);
        }
    }
}

processDir(dir);
