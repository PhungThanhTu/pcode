const fs = require('fs/promises')
const { execSync } = require('child_process');
const path = '/engine/judger'

const removeExtension = (filename) => {
    const slicedFileName = filename.split('.');
    const removedExtension = slicedFileName[0];
    return removedExtension;
}

const getJudgers = async () => {
    const listPaths = await fs.readdir(path);
    const cppPaths = listPaths
        .filter(filePath => filePath.includes('.cpp'))
        .map(filePath => removeExtension(filePath));
    return cppPaths;
};

const compileAllJudger = async () => {
    const judgers = await getJudgers();
    for (const judger of judgers) {
        execSync(`g++ -o ${judger} ${judger}.cpp`, {
            cwd: path
        });
    } 
}

compileAllJudger();