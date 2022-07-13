# @saulx/fs-walker

Walks folders and runs function on each item that matches.
Uses [@saulx/walker](https://github.com/atelier-saulx/utils#walker) check for more details.

```javascript
	import { fsWalk } from '@saulx/fs-walker;

	const result = []
	await fsWalk('./path_to_walt', async (item, info) => {
		result.push({
			value: item,		 // item path
			name: info.name, // file/dir name
			path: info.path, // item path
			type: info.type  // 'file' | 'dir'
		})
	}) // returns void
```

Configurable options:

```javascript
	await fsWalk(
		path,           // starting path
		itemFn,         // function to run for each matched item
		options: {
			              // check walker for details
			itemMatchFn,  // function to choose which items to run itemFn on
			recurseFn,    // function to choose which items to recurse on
			previousPath, // prefix to add to paths
		}
	})
```

Exemple:
Get all package.json file paths

```javascript
const packageJsons = []
await fsWalk(
	'./',
	async (item, _info) => {
		packageJsons.push(item)
	},
	{
		itemMatchFn: async (item) =>
			item.type === 'file' && item.name === 'package.json',
		recurseFn: async (item) =>
			item.type === 'dir' &&
			!['node_modules', 'tmp', 'dists'].includes(item.name),
	}
)
```
