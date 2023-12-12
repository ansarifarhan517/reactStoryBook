# ui-library

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/ui-library.svg)](https://www.npmjs.com/package/ui-library) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save ui-library
```

## Usage

```tsx
import React, { Component } from 'react'

import MyComponent from 'ui-library'
import 'ui-library/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```

## License

MIT © [company_name]

## Pending Task Items
 - Migrate Fontello Icons to Fontastic Font Icons
 - Assets - Need to be automatically copied to dist folder. Currently it is manual. 
 - Need to check what is code coverage metrics
 - For the entire component library, we will be skipping the CSS testing for now. Can be taken up later. Mostly it is relevant to atom components.

##Developer Guidelines
- **Naming Conventions:**
	- Variables
    	Interface: **I[Name]** or **I[Name]Props**. E.g.: IBoxProps, IButtonProps, etc
		Types: **t[Name]**. E.g.: tDisplay, tColor, tBgColor, etc.
	
	- Files
		Components: index.tsx
		Stories: xxx.stories.tsx
		Unit Tests: xxx.test.tsx
	
- **Before Raising Merge Requests:**
	- Make sure all your components are exported as part of the library in index.tsx
	
	- Storybook
		- Component should be listed appropriately in atoms, molecules or organisms folder.
		- Component should have knobs.
		- Component should have actions if User Interaction is possible.
		- Component source code should be visible in Story source tab.
		- Props details should be shown appropriately in Docs section.
	
	- Testing
		- Component should have .test.tsx files
		- Use `npm run test` or `npm run test:watch` to ensure no existing tests are failing.

## External References
    - Image Import
	   - https://www.pluralsight.com/guides/how-to-load-svg-with-react-and-webpack

## Version Details
    - "1.0.481" : Enhancements in Accordion
