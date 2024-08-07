---
name: Forms
description: 'How to build awesome forms in Preact that work anywhere.'
---

# Forms

Forms in Preact work much the same as they do in HTML. You render a control, and attach an event listener to it.

The main difference is that in most cases the `value` is not controlled by the DOM node, but by Preact.

---

<div><toc></toc></div>

---

## Controlled & Uncontrolled Components

When talking about form controls you'll often encounter the words "Controlled Component" and "Uncontrolled Component". The description refers to the way data flow is handled.

The DOM has a bidirectional data flow, because every form control will manage the user input themselves. A simple text input will always update its value when a user typed into it. In contrast, a framework like Preact generally has a unidirectional data flow; the component doesn't manage the value itself there, but something else higher up in the component tree.

Generally, you should try to use _Uncontrolled_ Components whenever possible, the DOM is fully capable of handling `<input>`'s state:

```jsx
// Uncontrolled, because Preact doesn't set the value
<input onInput={myEventHandler} />;
```

However, there are situations in which you might need to exert tighter control over the input value, in which case, _Controlled_ Components can be used.

To use controlled components in Preact, you will need to use [`refs`](/guide/v10/refs) to bridge the inherent gap between the DOM state and VDOM/Preact's state. Here's an example of how you might use a controlled component to limit the number of characters in an input field:

```jsx
// --repl
import { render } from "preact";
import { useState, useRef } from "preact/hooks";
// --repl-before
const Input = () => {
  const [value, setValue] = useState('')
  const inputRef = useRef()

  const onInput = (e) => {
    if (e.currentTarget.value.length <= 3) {
      setValue(e.currentTarget.value)
    } else {
      const start = inputRef.current.selectionStart
      const end = inputRef.current.selectionEnd
      const diffLength = Math.abs(e.currentTarget.value.length - value.length)
      inputRef.current.value = value
      // Restore selection
      inputRef.current.setSelectionRange(start - diffLength, end - diffLength)
    }
  }

  return (
	<>
	  <label>This input is limited to 3 characters: </label>
	  <input ref={inputRef} value={value} onInput={onInput} />
	</>
  );
}
// --repl-after
render(<Input />, document.getElementById("app"));
```

> For more information on controlled components in Preact, see [Controlled Inputs](https://www.jovidecroock.com/blog/controlled-inputs) by Jovi De Croock.

## Creating A Simple Form

Let's create a simple form to submit todo items. For this we create a `<form>`-Element and bind an event handler that is called whenever the form is submitted. We do a similar thing for the text input field, but note that we are storing the value in our class ourselves. You guessed it, we're using a _controlled_ input here. In this example it's very useful, because we need to display the input's value in another element.

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class TodoForm extends Component {
  state = { value: '' };

  onSubmit = e => {
    alert("Submitted a todo");
    e.preventDefault();
  }

  onInput = e => {
    this.setState({ value: e.currentTarget.value })
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <input type="text" value={value} onInput={this.onInput} />
        <p>You typed this value: {value}</p>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
// --repl-after
render(<TodoForm />, document.getElementById("app"));
```

## Select Input

A `<select>`-Element is a little more involved, but works similar to all other form controls:

```jsx
// --repl
import { render, Component } from "preact";

// --repl-before
class MySelect extends Component {
  state = { value: '' };

  onChange = e => {
    this.setState({ value: e.currentTarget.value });
  }

  onSubmit = e => {
    alert("Submitted " + this.state.value);
    e.preventDefault();
  }

  render(_, { value }) {
    return (
      <form onSubmit={this.onSubmit}>
        <select value={value} onChange={this.onChange}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    );
  }
}
// --repl-after
render(<MySelect />, document.getElementById("app"));
```

## Checkboxes & Radio Buttons

Checkboxes and radio buttons (`<input type="checkbox|radio">`) can initially cause confusion when building controlled forms. This is because in an uncontrolled environment, we would typically allow the browser to "toggle" or "check" a checkbox or radio button for us, listening for a change event and reacting to the new value.  However, this technique does not transition well into a world view where the UI is always updated automatically in response to state and prop changes.

> **Walk-Through:** Say we listen for a "change" event on a checkbox, which is fired when the checkbox is checked or unchecked by the user.  In our change event handler, we set a value in `state` to the new value received from the checkbox.  Doing so will trigger a re-render of our component, which will re-assign the value of the checkbox to the value from state.  This is unnecessary, because we just asked the DOM for a value but then told it to render again with whatever value we wanted.

So, instead of listening for a `input` event we should listen for a `click` event, which is fired any time the user clicks on the checkbox _or an associated `<label>`_.  Checkboxes just toggle between Boolean `true` and `false`, so clicking the checkbox or the label, we'll just invert whatever value we have in state, triggering a re-render, setting the checkbox's displayed value to the one we want.

### Checkbox Example

```jsx
// --repl
import { render, Component } from "preact";
// --repl-before
class MyForm extends Component {
  toggle = e => {
      let checked = !this.state.checked;
      this.setState({ checked });
  };

  render(_, { checked }) {
    return (
      <label>
        <input
          type="checkbox"
          checked={checked}
          onClick={this.toggle}
        />
        check this box
      </label>
    );
  }
}
// --repl-after
render(<MyForm />, document.getElementById("app"));
```
