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

| Prop               | Type     | Description                                                                                                                                |
| ------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `data`             | `object` | JSON data to be displayed within the component.                                                                                            |
| `theme?`           | `string` | Theme of the component. Options include `light`, `dark`, `beige`, and `coolBlue`.                                                          |
| `backgroundColor?` | `string` | Background color of the component. Accepts any valid CSS color value.                                                                      |
| `width?`           | `string` | Width of the component. Specify in valid CSS units (e.g., `100%`, `500px`).                                                                |
| `fontStyle?`       | `string` | Font style for the entire component text. Available options are `fira-code`, `courier-prime`, `dm-mono`, `ubuntu-mono`, `source-code-pro`. |
| `fontSize?`        | `string` | Font size for the component text. Specify in valid CSS units (e.g., `14px`, `1rem`).                                                       |
| `keyTextColor?`    | `string` | Color for JSON keys within the component. Accepts any valid CSS color value.                                                               |
| `valueTextColor?`  | `string` | Color for JSON values within the component. Accepts any valid CSS color value.                                                             |

### Basic Usage

```
import { JsonTree } from "render-json-tree";
import "render-json-tree/styles.css";

function App() {
  const jsonData = const json = [
  {
    userId: 1,
    id: 1,
    title: "Sit amet consectetur adipisicing elit. Commodi repudiandae",
    body: "dolor sit amet consectetur",
  },
  {
    userId: 133,
    id: 2,
    title: "qui est esse",
    body: "Lorem ipsum dolor sit amet consectetur.",
  },
  {
    organization: {
      name: "Tech Innovations Inc.",
      location: "Silicon Valley",
      departments: [
        {
          name: "Engineering",
          teams: [
            {
              name: "Backend Development",
              employees: [
                {
                  id: 1,
                  name: "Alice",
                  role: "Senior Developer",
                  projects: [
                    {
                      id: 101,
                      title: "API Development",
                      tasks: [
                        {
                          id: 1001,
                          description: "Design API architecture",
                          status: "Completed",
                        },
                        {
                          id: 1002,
                          description: "Implement authentication",
                          status: "In Progress",
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 2,
                  name: "Bob",
                  role: "Junior Developer",
                  projects: [
                    {
                      id: 102,
                      title: "Database Optimization",
                      tasks: [
                        {
                          id: 2001,
                          description: "Analyze query performance",
                          status: "Pending",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: "Marketing",
          teams: [
            {
              name: "Digital Marketing",
              employees: [
                {
                  id: 3,
                  name: "Charlie",
                  role: "Marketing Specialist",
                  projects: [
                    {
                      id: 201,
                      title: "Social Media Campaign",
                      tasks: [
                        {
                          id: 3001,
                          description: "Create content calendar",
                          status: "Completed",
                        },
                        {
                          id: 3002,
                          description: "Launch campaign",
                          status: "In Progress",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
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
