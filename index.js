'use strict';
const path = require('path');
const fs = require('fs');
const ghGot = require('gh-got');
module.exports = (repository, opts) => {
	const rulesPath = path.join(__dirname, 'rules');

	opts = opts || {};

	let repo;

	return Promise.all([
		ghGot(`repos/${repository}`, {token: opts.token}),
		ghGot(`repos/${repository}/branches/master`, {token: opts.token})
	])
	.then(result => {
		const data = result[0].body;
		const master = result[1].body;

		if (data.language.toLowerCase() !== 'javascript') {
			throw new TypeError('We can only validate JavaScript projects.');
		}

		repo = {
			_fullName: data.full_name,
			_name: data.name,
			_url: data.html_url,
			_issues: data.open_issues_count,
			_sha: master.commit.sha,
			validations: []
		};

		return ghGot(`repos/${repository}/git/trees/${repo._sha}`, {token: opts.token});
	})
	.then(data => {
		repo._tree = data.body.tree.map(file => file.path);

		return Promise.all(fs.readdirSync(rulesPath).map(rule =>
			require(path.join(rulesPath, rule))(repo, opts).catch(result => {
				if (result) {
					repo.validations = repo.validations.concat(result);
				}
			})
		));
	})
	.then(() => repo.validations);
};
