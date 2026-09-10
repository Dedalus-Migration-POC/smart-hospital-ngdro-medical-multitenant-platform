const fs = require('node:fs');
const path = require('node:path');

const packageJson = require('./package.json');
const indexHtmlPath = path.join(__dirname, 'dist', 'index.html');
const buildDate = new Date().toISOString();
const deploymentMarker = '<!-- deployment-info -->';
const deploymentInfo = `${deploymentMarker}\n<script>console.info('[${packageJson.name}] Build deployed: ${buildDate} (v${packageJson.version})');</script>`;

if (!fs.existsSync(indexHtmlPath)) {
    console.error(`Post-build skipped: ${indexHtmlPath} was not found.`);
    process.exitCode = 1;
} else {
    const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
    const updatedIndexHtml = indexHtml.includes(deploymentMarker)
        ? indexHtml.replace(new RegExp(`${deploymentMarker}[\\s\\S]*?</script>`), deploymentInfo)
        : indexHtml.replace('</head>', `  ${deploymentInfo}\n</head>`);

    fs.writeFileSync(indexHtmlPath, updatedIndexHtml, 'utf8');
    console.log(`Deployment information added to ${indexHtmlPath}: ${buildDate}`);
}