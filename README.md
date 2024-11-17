# render-json-tree

A flexible JSON tree component built with TypeScript for visualizing, editing, and enhancing JSON data. This package allows users to display JSON data in a hierarchical tree structure, edit the data directly, save changes, and add additional objects within existing structures. Ideal for applications that require an interactive JSON editor or a tree viewer.

## Features

- Have your JSON data in a tree structure
- Edit JSON values directly within the tree
- Save changes to the JSON data
- Add new key-value pairs or objects within existing JSON structures
- Customizable view styles, including dark mode support

## Installation

Install the `render-json-tree` package via npm:

```
npm install render-json-tree
```

| Prop               | Type       | Description                                                                                                                                |
| ------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`             | `object`   | JSON data to be displayed within the component.                                                                                            |
| `theme?`           | `string`   | Theme of the component. Options include `light`, `dark`, `beige`, and `coolBlue`.                                                          |
| `backgroundColor?` | `string`   | Background color of the component. Accepts any valid CSS color value.                                                                      |
| `width?`           | `string`   | Width of the component. Specify in valid CSS units (e.g., `100%`, `500px`).                                                                |
| `height?`          | `string`   | Height of the component. Specify in valid CSS units (e.g., `100%`, `500px`).                                                               |
| `fontStyle?`       | `string`   | Font style for the entire component text. Available options are `fira-code`, `courier-prime`, `dm-mono`, `ubuntu-mono`, `source-code-pro`. |
| `fontSize?`        | `string`   | Font size for the component text. Specify in valid CSS units (e.g., `14px`, `1rem`).                                                       |
| `keyTextColor?`    | `string`   | Color for JSON keys within the component. Accepts any valid CSS color value.                                                               |
| `valueTextColor?`  | `string`   | Color for JSON values within the component. Accepts any valid CSS color value.                                                             |
| `onSave?`          | `void=>()` | This is a callback function to get your changes made to the JSON                                                                           |

### Basic Usage

```
import { JsonTree } from "render-json-tree";
import "render-json-tree/styles.css";

function App() {
  const jsonData =[
    {
      id: 1,
      name: "John Doe",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: {
          name: "California",
          code: "CA",
          region: {
            name: "West Coast",
            population: 10000000,
          },
        },
      },
      hobbies: ["reading", "hiking", "coding"],
    },
  ];

  return (
      <JsonTree
        data={{ jsonData }}
        theme="light"
      ></JsonTree>
  );
}

export default App;

```
