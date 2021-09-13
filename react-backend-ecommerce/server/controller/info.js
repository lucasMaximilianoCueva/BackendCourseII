import os from "os";

const numCPUs = os.cpus().length;

async function getInfoController(req, res) {
  res.json({
    inputArguments: process.argv,
    platformName: process.platform,
    nodejsVersion: process.version,
    memoryUsage: process.memoryUsage(),
    executionPath: process.execPath,
    processId: process.pid,
    currentFolder: process.cwd,
    cpus: numCPUs,
  });
}

export { getInfoController } 
