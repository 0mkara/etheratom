const remixResolve = require('remix-resolve');

module.exports = async function(rootpath, sources) {
    const done = this.async();

    console.log(
        `Import task: processing, rootpath=${rootpath}, sources=${Object.keys(
            sources
        )}`
    );

    try {
        const combinedSources = await remixResolve.combineSource(
            rootpath,
            sources
        );
        emit('combinedSources', combinedSources);
    } catch (exception) {
        emit('error', exception.message);
    }

    console.log('Import task: done processing.');

    done();
};
