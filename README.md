# Faster React/Typescript TDD using Vite and Vitest

## Moving away from Legacy Bundlers
Attempting to perform TDD with React and Typescript using traditional bundlers has always been a slow and complex experience. Webpack is massively flexible, but with that comes a slow developer experience and complex configuration. 

Fortunately [Vite](https://vitejs.dev/) has emeregd to massively improve server start up (especially using the [Speedy Web Compiler](https://www.dhiwise.com/post/maximize-performance-how-swc-enhances-vite-and-react) template), and generally supply a faster developer feedback experience more conducive to a TDD approach. Furthermore it simplifies the dependencies and toolchain configuration required for modern standards-compliant browsers.   

And now with the advent of [Vitest](https://vitest.dev/) we have a simplified test framework that supports Jest and React Testing Library almost (with a few tweaks) out of the box with much less onerous configuration.

This project is the templated react typescript swc app with AFAIK the minimum configuration for Vitest with RTL/Jest. Though I have added a `customRender` that can be edited to allow flexibility for testing with providers.

## Pre-requisites
NB I am using WSL with VSCode on Windows using VS Code Server

You should of course have [NodeJS](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) installed. I will be using [bun](https://bun.sh/docs/installation) as a package manager as it is significantly faster than npm or yarn:

```bash
npm install -g bun
```

## Setup and run a React/Typescript project with Vite
We'll use the template to create our app and install and test everything works correctly.

Note that we are using the [Speedy Web Compiler (swc)](https://swc.rs/) vite template rather than the Babel-based [Hot Module Replacment (HMR)]()
```bash
bunx create-vite react-ts-vitest-tdd-demo --template react-swc-ts
cd react-ts-vitest-tdd-demo
bun install
bun run dev
```
You should now have your vite app up and running.

## Setup Vitest with React Testing Library/Jest

First we need to install the dev dependencies packages:

```bash
bun install -d vitest
bun install -d jsdom
bun install -d @testing-library/react
bun install -d @testing-library/jest-dom 
bun install -d @testing-library/user-event 
bun install -d @types/jest
```

And add the following test script in the `package.json` file:

```js
  "scripts": {
    ...
    "test" : "vitest"
  },
```

Now we need to add a couple of references and modify a test section to the `vite.config.ts` so it looks something like teh following:

```js
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    // you might want to disable it, if you don't have tests that rely on CSS
    // since parsing CSS is slow
    css: true,    
  }
})
```

Create the `src/test/setup.ts` file with the following line:

```js
import '@testing-library/jest-dom'
```

Additionaly cretae a `src/test/test-utils.tsx` file with the following content:

```js
import { cleanup, render } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })
}

export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
// override render export
export { customRender as render }
```

Finally we are ready to add a test for the App.tsx. Create a file `src/App.test.tsx` with the following content:

```js
import App from './App'
import { render, screen, userEvent } from './test/test-utils'

describe('Simple working test', () => {

  it('should increment count on click', async () => {
    render(<App />)
    userEvent.click(screen.getByRole('button'))
    expect(await screen.findByText(/count is 1/i)).toBeVisible()
  })
})
```

Now we are ready to run our test:

```bash
bun run test
```
## Getting started with TDD

By default Vitest will run in watch mode so that if you save any files the tests will re-run. This is perfect for TDD.

You should now be in a position to clean up the example `App` code and start writing your tests and then your code.

Here are some articles for further reading:
* [The EricWinkDev Video this is partially based on](https://www.youtube.com/watch?v=G-4zgIPsjkU)

* [TDD with React and Typescript](https://dev.to/pauleveritt/react-typescript-and-tdd-1ne7)

* [Vite Community Templates](https://github.com/vitejs/awesome-vite#templates)
