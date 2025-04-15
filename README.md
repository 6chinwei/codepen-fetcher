# CodePen Fetcher
  
[![Node Current](https://img.shields.io/node/v/codepen-fetcher)](https://www.npmjs.com/package/codepen-fetcher) 
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/6chinwei/codepen-fetcher/unit-test.yaml?branch=main&label=unit+test)](https://github.com/6chinwei/codepen-fetcher/actions/workflows/unit-test.yaml) 
[![Codecov](https://img.shields.io/codecov/c/gh/6chinwei/codepen-fetcher)](https://app.codecov.io/gh/6chinwei/codepen-fetcher/)

An unofficial CodePen Node.js library built with TypeScript, capable of fetching the HTML, CSS, and JS source code of public Pens without authentication. It is designed for use in workflow automation tasks.

This library uses a workaround to retrieve data via the `https://codepen.io/graphql` API, which may break if the API changes.

## Installation
```bash
$ npm install codepen-fetcher
```

## Usage
### Fetch a pen
Fetch a pen by its `penId`, which can be found in the URL of the pen. For example, the `penId` of https://codepen.io/6chinwei/pen/gbYRQmN is `gbYRQmN`.

```javascript
import { fetchPen } from 'codepen-fetcher';

const penId = 'gbYRQmN';
const pen = await fetchPen(penId);
console.log(pen);
```
Example output is:
```javascript
{
  access: 'Public',
  config: {
    css: 'body {\n  text-align: center;\n}',
    cssPreProcessor: 'none',
    head: '',
    html: '<h1>Hello World</h1>',
    js: "console.log('Hello World');",
    jsPreProcessor: 'none'
  },
  createdAt: '2024-12-25 10:31:31 UTC',
  description: { source: { body: 'This is an example pen' } },
  id: 'gbYRQmN',
  owner: { id: 'DEnXWE', username: '6chinwei' },
  tags: [ 'example' ],
  title: 'Example Pen',
  updatedAt: '2024-12-25 10:36:12 UTC',
  url: 'https://codepen.io/6chinwei/pen/gbYRQmN'
}
```
Note that the source code of the pen is stored in the `config` object.

### Fetch a user profile
Fetch a CodePen user's profile (e.g., ID and Name) by their username.

```javascript
import { fetchProfile } from 'codepen-fetcher';

const username = '6chinwei';
const userProfile = await fetchProfile(username);
console.log(userProfile);
```
An example output is:
```javascript
{
  avatar: 'https://assets.codepen.io/1103539/internal/avatars/users/default.png?format=auto&version=1734538260',
  bio: '',
  id: 'DEnXWE',
  location: 'Taiwan',
  name: '6chinwei',
  pro: false,
  username: '6chinwei'
}
```

### Fetch pens by user ID
```javascript
import { fetchPensByUserId } from 'codepen-fetcher';
const userId = 'DEnXWE';
const options = { limit: 5 };

const pens = await fetchPensByUserId(userId, options);
console.log(pens);
```
An example output is:
```javascript
[
  {
    access: 'Public',
    config: {
      css: 'body {\n  text-align: center;\n}',
      cssPreProcessor: 'none',
      head: '',
      html: '<h1>Hello World</h1>',
      js: "console.log('Hello World');",
      jsPreProcessor: 'none'
    },
    createdAt: '2024-12-25 10:31:31 UTC',
    description: { source: { body: 'This is an example pen' } },
    id: 'gbYRQmN',
    owner: { id: 'DEnXWE', username: '6chinwei' },
    tags: [ 'example' ],
    title: 'Example Pen',
    updatedAt: '2024-12-25 10:36:12 UTC',
    url: 'https://codepen.io/6chinwei/pen/gbYRQmN'
  },
  // ...
]
```

## Showcase
**[6chinwei/codepen-repository](https://github.com/6chinwei/codepen-repository)**  
Automatically download all public pens from [codepen.io/6chinwei](https://codepen.io/6chinwei) and commit the source code to Git repository.  

## Development
1. Clone the repo
2. Use Node.js v20 or later
3. Install dependencies
   ```bash
   $ npm install  
   ```

### Unit tests
To watch for file changes and re-run tests automatically, use
```bash
$ npm run test
```

Run all unit tests once, use
```bash
$ npm run test:unit
```

### Integration tests
> Test bundle code with real CodePen APIs
  
```bash
# Build the project first
$ npm run build

$ npm run test:integration
```
