'use babel'
// helper function for combining sources
import path from 'path';

function mapSourceDir(dir,file){
	return path.isAbsolute(file)
	? dir
	: path.dirname(
        path.normalize(dir + '/' + file)
    );
}

export default mapSourceDir;
