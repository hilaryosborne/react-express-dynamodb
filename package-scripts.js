const { series, rimraf, mkdirp, concurrent } = require('nps-utils');
module.exports = {
    scripts: {
        default: 'nps local',
        local: {
            description: 'Scripts to run the micro frontend locally for development and demonstration',
            default: series('npx nps local.serve'),
            serve: concurrent({
                assets: 'npx nps local.assets',
                server: 'npx nps local.server',
            }),
            setup: 'chmod +x ./.docker/fontawesome.sh && ./.docker/fontawesome.sh',
            assets: 'npx webpack --mode=development --watch --config ./webpack.config.js',
            server: {
                default: 'npx nps local.server.watch',
                watch: 'nodemon --watch src -e .ts,.tsx,.js --exec npx nps local.server.build',
                build: 'babel-node --extensions .ts,.tsx,.js --config-file ./babel.server.config.json src/server.ts',
            },
        },
        standards: {
            default: series('npx nps standards.unit', 'npx nps standards.integration', 'npx nps standards.lockfile'),
            unit: 'npx jest',
            integration: series(
                'npx nps build.assets',
                concurrent({
                    storybook: 'npx nps storybook.ci',
                    localLambda: 'npx nps local.server',
                    cypress:
                        ' npx wait-on http://localhost:9000' +
                        ' && npx cypress run',
                }),
            ),
            lockfile: 'node check-lockfiles.js',
        },
        build: {
            description: 'Builds Micro UI for server deployment',
            default: series(
                'npx nps clean',
                'npx nps build.server',
                'npx nps build.assets',
            ),
            server: `npx babel src --extensions '.ts,.tsx,.js' --config-file ./babel.server.config.json --out-dir ./.server`,
            assets: series(mkdirp('.assets'), `npx webpack --mode=production --config ./webpack.config.js`),
        },
        clean: {
            description: 'Deletes the various generated folders',
            script: series(rimraf('./.server'), rimraf('./.assets'), rimraf('./.docs')),
        },
    },
};