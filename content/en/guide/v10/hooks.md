---
title: Hooks
description: Hooks in Preact allow you to compose behaviours together and re-use that logic in different components
---

# Hooks

The Hooks API is an alternative way to write components in Preact. Hooks allow you to compose state and side effects, reusing stateful logic much more easily than with class components.

If you've worked with class components in Preact for a while, you may be familiar with patterns like "render props" and "higher order components" that try to solve these challenges. These solutions have tended to make code harder to follow and more abstract. The hooks API makes it possible to neatly extract the logic for state and side effects, and also simplifies unit testing that logic independently from the components that rely on it.

Hooks can be used in any component, and avoid many pitfalls of the `this` keyword relied on by the class components API. Instead of accessing properties from the component instance, hooks rely on closures. This makes them value-bound and eliminates a number of stale data problems that can occur when dealing with asynchronous state updates.

There are two ways to import hooks: from `preact/hooks` or `preact/compat`.

---

<toc></toc>

---

## Introduction

The easiest way to understand hooks is to compare them to equivalent class-based Components.

We'll use a simple counter component as our example, which renders a number and a button that increases it by one:

```jsx
// --repl
import { render, Component } from 'preact';
// --repl-before
class Counter extends Component {
	state = {
		value: 0
	};

	increment = () => {
		this.setState(prev => ({ value: prev.value + 1 }));
	};

	render(props, state) {
		return (
			<div>
				<p>Counter: {state.value}</p>
				<button onClick={this.increment}>Increment</button>
			</div>
		);
	}
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

Now, here's an equivalent function component built with hooks:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Counter() {
	const [value, setValue] = useState(0);
	const increment = useCallback(() => {
		setValue(value + 1);
	}, [value]);

	return (
		<div>
			<p>Counter: {value}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

At this point they seem pretty similar, however we can further simplify the hooks version.

Let's extract the counter logic into a custom hook, making it easily reusable across components:

```jsx
// --repl
import { useState, useCallback } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function useCounter() {
	const [value, setValue] = useState(0);
	const increment = useCallback(() => {
		setValue(value + 1);
	}, [value]);
	return { value, increment };
}

// First counter
function CounterA() {
	const { value, increment } = useCounter();
	return (
		<div>
			<p>Counter A: {value}</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
}

// Second counter which renders a different output.
function CounterB() {
	const { value, increment } = useCounter();
	return (
		<div>
			<h1>Counter B: {value}</h1>
			<p>I'm a nice counter</p>
			<button onClick={increment}>Increment</button>
		</div>
	);
}
// --repl-after
render(
	<div>
		<CounterA />
		<CounterB />
	</div>,
	document.getElementById('app')
);
```

Note that both `CounterA` and `CounterB` are completely independent of each other. They both use the `useCounter()` custom hook, but each has its own instance of that hook's associated state.

> Thinking this looks a little strange? You're not alone!
>
> It took many of us a while to grow accustomed to this approach.

## The dependency argument

Many hooks accept an argument that can be used to limit when a hook should be updated. Preact inspects each value in a dependency array and checks to see if it has changed since the last time a hook was called. When the dependency argument is not specified, the hook is always executed.

In our `useCounter()` implementation above, we passed an array of dependencies to `useCallback()`:

```jsx
function useCounter() {
	const [value, setValue] = useState(0);
	const increment = useCallback(() => {
		setValue(value + 1);
	}, [value]); // <-- the dependency array
	return { value, increment };
}
```

Passing `value` here causes `useCallback` to return a new function reference whenever `value` changes.
This is necessary in order to avoid "stale closures", where the callback would always reference the first render's `value` variable from when it was created, causing `increment` to always set a value of `1`.

> This creates a new `increment` callback every time `value` changes.
> For performance reasons, it's often better to use a [callback](#usestate) to update state values rather than retaining the current value using dependencies.

## Stateful hooks

Here we'll see how we can introduce stateful logic into functional components.

Prior to the introduction of hooks, class components were required anywhere state was needed.

### useState

This hook accepts an argument, this will be the initial state. When
invoked this hook returns an array of two variables. The first being
the current state and the second being the setter for our state.

Our setter behaves similar to the setter of our classic state.
It accepts a value or a function with the currentState as argument.

When you call the setter and the state is different, it will trigger
a rerender starting from the component where that useState has been used.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useState } from 'preact/hooks';

const Counter = () => {
	const [count, setCount] = useState(0);
	const increment = () => setCount(count + 1);
	// You can also pass a callback to the setter
	const decrement = () => setCount(currentCount => currentCount - 1);

	return (
		<div>
			<p>Count: {count}</p>
			<button onClick={increment}>Increment</button>
			<button onClick={decrement}>Decrement</button>
		</div>
	);
};
// --repl-after
render(<Counter />, document.getElementById('app'));
```

> When our initial state is expensive it's better to pass a function instead of a value.

### useReducer

The `useReducer` hook has a close resemblance to [redux](https://redux.js.org/). Compared to [useState](#usestate) it's easier to use when you have complex state logic where the next state depends on the previous one.

```jsx
// --repl
import { render } from 'preact';
// --repl-before
import { useReducer } from 'preact/hooks';

const initialState = 0;
const reducer = (state, action) => {
	switch (action) {
		case 'increment':
			return state + 1;
		case 'decrement':
			return state - 1;
		case 'reset':
			return 0;
		default:
			throw new Error('Unexpected action');
	}
};

function Counter() {
	// Returns the current state and a dispatch function to
	// trigger an action
	const [count, dispatch] = useReducer(reducer, initialState);
	return (
		<div>
			{count}
			<button onClick={() => dispatch('increment')}>+1</button>
			<button onClick={() => dispatch('decrement')}>-1</button>
			<button onClick={() => dispatch('reset')}>reset</button>
		</div>
	);
}
// --repl-after
render(<Counter />, document.getElementById('app'));
```

## Memoization

In UI programming there is often some state or result that's expensive to calculate. Memoization can cache the results of that calculation allowing it to be reused when the same input is used.

### useMemo

With the `useMemo` hook we can memoize the results of that computation and only recalculate it when one of the dependencies changes.

```jsx
const memoized = useMemo(
	() => expensive(a, b),
	// Only re-run the expensive function when any of these
	// dependencies change
	[a, b]
);
```

> Don't run any effectful code inside `useMemo`. Side-effects belong in `useEffect`.

### useCallback

The `useCallback` hook can be used to ensure that the returned function will remain referentially equal for as long as no dependencies have changed. This can be used to optimize updates of child components when they rely on referential equality to skip updates (e.g. `shouldComponentUpdate`).

```jsx
const onClick = useCallback(() => console.log(a, b), [a, b]);
```

> Fun fact: `useCallback(fn, deps)` is equivalent to `useMemo(() => fn, deps)`.

## Refs

**Ref**erences are stable, local values that persist across rerenders but don't cause rerenders themselves. See [Refs](/guide/v10/refs) for more information & examples.

### useRef

To create a stable reference to a DOM node or a value that persists between renders, we can use the `useRef` hook. It works similarly to [createRef](/guide/v10/refs#createref).

```jsx
// --repl
import { useRef } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
function Foo() {
	// Initialize useRef with an initial value of `null`
	const input = useRef(null);
	const onClick = () => input.current && input.current.focus();

	return (
		<>
			<input ref={input} />
			<button onClick={onClick}>Focus input</button>
		</>
	);
}
// --repl-after
render(<Foo />, document.getElementById('app'));
```

> Be careful not to confuse `useRef` with `createRef`.

### useImperativeHandle

To mutate a ref that is passed into a child component we can use the `useImperativeHandle` hook. It takes three arguments: the ref to mutate, a function to execute that will return the new ref value, and a dependency array to determine when to rerun.

```jsx
// --repl
import { render } from 'preact';
import { useRef, useImperativeHandle, useState } from 'preact/hooks';
// --repl-before
function MyInput({ inputRef }) {
	const ref = useRef(null);
	useImperativeHandle(
		inputRef,
		() => {
			return {
				// Only expose `.focus()`, don't give direct access to the DOM node
				focus() {
					ref.current.focus();
				}
			};
		},
		[]
	);

	return (
		<label>
			Name: <input ref={ref} />
		</label>
	);
}

function App() {
	const inputRef = useRef(null);

	const handleClick = () => {
		inputRef.current.focus();
	};

	return (
		<div>
			<MyInput inputRef={inputRef} />
			<button onClick={handleClick}>Click To Edit</button>
		</div>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## useContext

To access context in a functional component we can use the `useContext` hook, without any higher-order or wrapper components. The first argument must be the context object that's created from a `createContext` call.

```jsx
// --repl
import { render, createContext } from 'preact';
import { useContext } from 'preact/hooks';

const OtherComponent = props => props.children;
// --repl-before
const Theme = createContext('light');

function DisplayTheme() {
	const theme = useContext(Theme);
	return <p>Active theme: {theme}</p>;
}

// ...later
function App() {
	return (
		<Theme.Provider value="light">
			<OtherComponent>
				<DisplayTheme />
			</OtherComponent>
		</Theme.Provider>
	);
}
// --repl-after
render(<App />, document.getElementById('app'));
```

## Side-Effects

Side-Effects are at the heart of many modern Apps. Whether you want to fetch some data from an API or trigger an effect on the document, you'll find that the `useEffect` fits nearly all your needs. It's one of the main advantages of the hooks API, that it reshapes your mind into thinking in effects instead of a component's lifecycle.

### useEffect

As the name implies, `useEffect` is the main way to trigger various side-effects. You can even return a cleanup function from your effect if one is needed.

```jsx
useEffect(() => {
	// Trigger your effect
	return () => {
		// Optional: Any cleanup code
	};
}, []);
```

We'll start with a `Title` component which should reflect the title to the document, so that we can see it in the address bar of our tab in our browser.

```jsx
function PageTitle(props) {
	useEffect(() => {
		document.title = props.title;
	}, [props.title]);

	return <h1>{props.title}</h1>;
}
```

The first argument to `useEffect` is an argument-less callback that triggers the effect. In our case we only want to trigger it, when the title really has changed. There'd be no point in updating it when it stayed the same. That's why we're using the second argument to specify our [dependency-array](#the-dependency-argument).

But sometimes we have a more complex use case. Think of a component which needs to subscribe to some data when it mounts and needs to unsubscribe when it unmounts. This can be accomplished with `useEffect` too. To run any cleanup code we just need to return a function in our callback.

```jsx
// --repl
import { useState, useEffect } from 'preact/hooks';
import { render } from 'preact';
// --repl-before
// Component that will always display the current window width
function WindowWidth(props) {
	const [width, setWidth] = useState(0);

	function onResize() {
		setWidth(window.innerWidth);
	}

	useEffect(() => {
		window.addEventListener('resize', onResize);
		return () => window.removeEventListener('resize', onResize);
	}, []);

	return <p>Window width: {width}</p>;
}
// --repl-after
render(<WindowWidth />, document.getElementById('app'));
```

> The cleanup function is optional. If you don't need to run any cleanup code, you don't need to return anything in the callback that's passed to `useEffect`.

### useLayoutEffect

Similar to [`useEffect`](#useeffect), `useLayoutEffect` is used to trigger side-effects but it will do so as soon as the component is diffed and before the browser has a chance to repaint. Commonly used for measuring DOM elements, this allows you to avoid flickering or pop-in that may occur if you use `useEffect` for such tasks.

```jsx
import { useLayoutEffect, useRef } from 'preact/hooks';

function App() {
	const hintRef = useRef(null);

	useLayoutEffect(() => {
		const hintWidth = hintRef.current.getBoundingClientRect().width;

		// We might use this width to position and center the hint on the screen, like so:
		hintRef.current.style.left = `${(window.innerWidth - hintWidth) / 2}px`;
	}, []);

	return (
		<div style="display: inline; position: absolute" ref={hintRef}>
			<p>This is a hint</p>
		</div>
	);
}
```

### useErrorBoundary

Whenever a child component throws an error you can use this hook to catch it and display a custom error UI to the user.

```jsx
// error = The error that was caught or `undefined` if nothing errored.
// resetError = Call this function to mark an error as resolved. It's
//   up to your app to decide what that means and if it is possible
//   to recover from errors.
const [error, resetError] = useErrorBoundary();
```

For monitoring purposes it's often incredibly useful to notify a service of any errors. For that we can leverage an optional callback and pass that as the first argument to `useErrorBoundary`.

```jsx
const [error] = useErrorBoundary(error => callMyApi(error.message));
```

A full usage example may look like this:

```jsx
const App = props => {
	const [error, resetError] = useErrorBoundary(error =>
		callMyApi(error.message)
	);

	// Display a nice error message
	if (error) {
		return (
			<div>
				<p>{error.message}</p>
				<button onClick={resetError}>Try again</button>
			</div>
		);
	} else {
		return <div>{props.children}</div>;
	}
};
```

> If you've been using the class based component API in the past, then this hook is essentially an alternative to the [componentDidCatch](/guide/v10/whats-new/#componentdidcatch) lifecycle method.
> This hook was introduced with Preact 10.2.0.

## Utility hooks

### useId

This hook will generate a unique identifier for each invocation and guarantees that these will be consistent when rendering both [on the server](/guide/v10/server-side-rendering) and the client. A common use case for consistent IDs are forms, where `<label>`-elements use the [`for`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#attr-for) attribute to associate them with a specific `<input>`-element. The `useId` hook isn't tied to just forms though and can be used whenever you need a unique ID.

> To make the hook consistent you will need to use Preact on both the server
> as well as on the client.

A full usage example may look like this:

```jsx
const App = props => {
  const mainId = useId();
  const inputId = useId();

  useLayoutEffect(() => {
    document.getElementById(inputId).focus()
  }, [])

  // Display an input with a unique ID.
  return (
    <main id={mainId}>
      <input id={inputId}>
    </main>
  )
};
```

> This hook was introduced with Preact 10.11.0 and needs preact-render-to-string 5.2.4.

### useDebugValue

Displays a custom label for use in the Preact DevTools browser extension. Useful for custom hooks to provide additional context about the state or value they represent.

```jsx
import { useDebugValue, useState } from 'preact/hooks';

function useCount() {
	const [count, setCount] = useState(0);
	useDebugValue(count > 0 ? 'Positive' : 'Negative');
	return [count, setCount];
}
```

In your devtools, this will display as `useCount: "Positive"` or `useCount: "Negative"`, whereas previously it would've been just `useCount`.

Optionally, you can also pass a function as the second argument to `useDebugValue` for use as the "formatter".

```jsx
import { useDebugValue, useState } from 'preact/hooks';

function useCount() {
	const [count, setCount] = useState(0);
	useDebugValue(count, c => `Count: ${c}`);
	return [count, setCount];
}
```

## Compat-specific hooks

We offer some additional hooks only through the `preact/compat` package, as they are either stubbed-out implementations or are not part of the essential hooks API.

### useSyncExternalStore

Allows you to subscribe to an external data source, such as a global state management library, browser APIs, or any other external (to Preact) data source.

```jsx
import { useSyncExternalStore } from 'preact/compat';

function subscribe(cb) {
	addEventListener('scroll', cb);
	return () => removeEventListener('scroll', cb);
}

function App() {
	const scrollY = useSyncExternalStore(subscribe, () => window.scrollY);
}
```

### useDeferredValue

Stubbed-out implementation, immediately returns the value as Preact does not support concurrent rendering.

```jsx
import { useDeferredValue } from 'preact/compat';

function App() {
	const deferredValue = useDeferredValue('Hello, World!');
}
```

### useTransition

Stubbed-out implementation as Preact does not support concurrent rendering.

```jsx
import { useTransition } from 'preact/compat';

function App() {
	// `isPending` will always be `false`
	const [isPending, startTransition] = useTransition();

	const handleClick = () => {
		// Immediately executes the callback, it's a no-op.
		startTransition(() => {
			// Transition code here
		});
	};
}
```

### useInsertionEffect

Stubbed-out implementation, matches [`useLayoutEffect`](#uselayouteffect) in functionality.

```jsx
import { useInsertionEffect } from 'preact/compat';

function App() {
	useInsertionEffect(() => {
		// Effect code here
	}, [dependencies]);
}
```
