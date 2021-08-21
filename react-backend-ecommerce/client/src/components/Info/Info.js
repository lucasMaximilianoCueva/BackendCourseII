import React, { useEffect, useState } from 'react';
import pino from 'pino'

const logger = pino({
  prettyPrint: { colorize: true }
});

function Info() {
    const [data, setData] = useState([]);

    useEffect(() => {
      fetch("/api/info")
          .then(res => res.json())
          .then(res => setData(res))
          .catch(err => {
            logger.info(err);
          });
    }, []);

    return (
        <div className="mt-4">
            <h3 className="text-center mb-4">Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{`Input Arguments: ${data.inputArguments}`}</li>
                <li className="list-group-item">{`Platform Name: ${data.platformName}`}</li>
                <li className="list-group-item">{`Node.js Version: ${data.nodejsVersion}`}</li>
                <li className="list-group-item">{`Memory Usage: ${data.memoryUsage}`}</li>
                <li className="list-group-item">{`Execution Path: ${data.executionPath}`}</li>
                <li className="list-group-item">{`Process ID: ${data.processId}`}</li>
                <li className="list-group-item">{`Current Folder: ${data.currentFolder}`}</li>
            </ul>
        </div>
    )
}

export default Info;