# @saulx/fs-walker

Walks folders and runs function on each item that matches.
Uses [@saulx/walker](https://github.com/atelier-saulx/utils#walker) check for more details.

```javascript
	const result = []
	await walk('./path_to_walt', async (item, info) => {
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
	await walk(
		path, // starting path
		itemFn, // function to run for each matched item
		options: {
			// check walker for details
			itemMatchFn, // function to choose which items to run itemFn on
			previousPath, // prefix to add to paths
		}
	})
```
