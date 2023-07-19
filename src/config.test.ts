import { getConfigFiles, ConfigFile } from './config';
import { DEFAULT_OPTIONS } from './constants'; 
import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

test('generates valid config files', async () => {
    const files = (await createTemporaryConfigFiles(getConfigFiles(DEFAULT_OPTIONS))).filter(file => file.endsWith('.lua'));
    const tempDir = path.dirname(files[0]);
    for (const file of files) {
        expect(() => execSync(`awesome -c ${file} -k`)).not.toThrow();
    }
    deleteTemporaryConfigFiles(tempDir);

    async function createTemporaryConfigFiles(configFiles: ConfigFile[]) {
        const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tmp-config-test'));

        const promises = configFiles.map(async configFile => {
            const filePath = path.join(tempDir, path.basename(configFile.path));
            fs.writeFileSync(filePath, await configFile.contents.text());
        });

        await Promise.all(promises)

        const files = configFiles.map(configFile => path.join(tempDir, path.basename(configFile.path)));
        return files;
    }

    function deleteTemporaryConfigFiles(tempDir: string) {
        fs.rmSync(tempDir, { recursive: true });
    }
})