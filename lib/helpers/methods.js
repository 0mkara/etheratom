'use babel'
// helper function for combining sources
import path from 'path';

export function mapSourceDir(dir, file) {
	return path.isAbsolute(file)
	? dir
	: path.dirname(
        path.normalize(dir + '/' + file)
    );
}
