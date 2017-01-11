'use strict';
const path = require('path');
const detectIndent = require('detect-indent');
const FileSystem = require('./fs/filesystem');
const fileparser = require('./fs/fileparser');

class Fixer {

	constructor() {
		this._fs = new FileSystem();
		this._fileDescriptors = new Map();
	}

	get files() {
		return this._fileDescriptors.values();
	}

	fixAll(validations) {
		return validations.reduce((ret, validation) => {
			return ret.then(() => this.fix(validation));
		}, Promise.resolve());
	}

	fix(validation) {
		let ret = Promise.resolve();

		const file = validation.file;

		if (!this._fileDescriptors.has(file)) {
			ret = ret
				.then(() => this._fs.readFile(file, false))
				.then(contents => {
					contents = contents || '';

					const ext = path.extname(file);
					const indent = detectIndent(contents).indent;
					const lastchar = contents.split('\n').pop().trim().length === 0 ? '\n' : '';

					this._fileDescriptors.set(file, {
						file,
						ext,
						indent,
						lastchar,
						contents: fileparser.parse(file, contents)
					});
				});
		}

		return ret.then(() => {
			const fd = this._fileDescriptors.get(file);

			return Promise.resolve()
				.then(() => validation.fix(fd.contents))
				.then(newContent => {
					fd.contents = newContent;
					this._fileDescriptors.set(file, fd);

					return newContent;
				});
		});
	}
}

module.exports = Fixer;
