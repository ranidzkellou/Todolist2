export const mockData = [
  {
    id: 1,
    title: "Work",
    emoji: "🚀",
    details: "All work-related tasks and projects.",
    tasks: [
      {
        id: 1,
        title: "Initialize Git repository",
        details: "Set up a new Git repository for the project.",
        priority: "High",
        deadline: "2024-12-05",
        deadlineTime: "14:30",
        categories: ["Work", "Development"],
        createdAt: "2024-12-01T10:00:00Z",
        subtasks: [
          {
            title: "Create .gitignore file",
            deadlineTime: "15:00",
            priority: "Medium"
          },
          {
            title: "Add initial commit",
            deadlineTime: "16:00",
            priority: "Low"
          }
        ]
      },
      {
        id: 2,
        title: "Setup development environment",
        details: "Install necessary tools and dependencies.",
        priority: "Medium",
        deadline: "2024-12-06",
        deadlineTime: "10:00",
        categories: ["Work", "Development"],
        createdAt: "2024-12-01T11:00:00Z",
        subtasks: [
          {
            title: "Install Node.js",
            deadlineTime: "11:00",
            priority: "High"
          },
          {
            title: "Install VSCode",
            deadlineTime: "12:00",
            priority: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Frontend Development",
    emoji: "💻",
    details: "All frontend development tasks and projects.",
    tasks: [
      {
        id: 3,
        title: "Create component structure",
        details: "Design the component hierarchy for the frontend.",
        priority: "High",
        deadline: "2024-12-07",
        deadlineTime: "14:00",
        categories: ["Frontend", "Design"],
        createdAt: "2024-12-02T09:00:00Z",
        subtasks: [
          {
            title: "Define component props",
            deadlineTime: "15:00",
            priority: "High"
          },
          {
            title: "Create initial components",
            deadlineTime: "16:00",
            priority: "Medium"
          }
        ]
      },
      {
        id: 4,
        title: "Implement routing",
        details: "Set up routing for the application.",
        priority: "Medium",
        deadline: "2024-12-08",
        deadlineTime: "10:00",
        categories: ["Frontend", "Development"],
        createdAt: "2024-12-02T10:00:00Z",
        subtasks: [
          {
            title: "Install React Router",
            deadlineTime: "11:00",
            priority: "High"
          },
          {
            title: "Define routes",
            deadlineTime: "12:00",
            priority: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Testing",
    emoji: "🧪",
    details: "All testing-related tasks and projects.",
    tasks: [
      {
        id: 5,
        title: "Write unit tests",
        details: "Create unit tests for the application.",
        priority: "Low",
        deadline: "2024-12-09",
        deadlineTime: "14:00",
        categories: ["Testing", "QA"],
        createdAt: "2024-12-03T09:00:00Z",
        subtasks: [
          {
            title: "Test component rendering",
            deadlineTime: "15:00",
            priority: "High"
          },
          {
            title: "Test API calls",
            deadlineTime: "16:00",
            priority: "Medium"
          }
        ]
      },
      {
        id: 6,
        title: "Run integration tests",
        details: "Execute integration tests for the application.",
        priority: "Medium",
        deadline: "2024-12-10",
        deadlineTime: "10:00",
        categories: ["Testing", "QA"],
        createdAt: "2024-12-03T10:00:00Z",
        subtasks: [
          {
            title: "Set up test environment",
            deadlineTime: "11:00",
            priority: "High"
          },
          {
            title: "Run tests",
            deadlineTime: "12:00",
            priority: "Medium"
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Documentation",
    emoji: "📝",
    details: "All documentation-related tasks and projects.",
    tasks: [
      {
        id: 7,
        title: "Write API documentation",
        details: "Document the API endpoints and usage.",
        priority: "High",
        deadline: "2024-12-11",
        deadlineTime: "14:00",
        categories: ["Documentation", "API"],
        createdAt: "2024-12-04T09:00:00Z",
        subtasks: [
          {
            title: "Document endpoints",
            deadlineTime: "15:00",
            priority: "High"
          },
          {
            title: "Add examples",
            deadlineTime: "16:00",
            priority: "Medium"
          }
        ]
      },
      {
        id: 8,
        title: "Update README file",
        details: "Update the README file with the latest information.",
        priority: "Medium",
        deadline: "2024-12-12",
        deadlineTime: "10:00",
        categories: ["Documentation", "README"],
        createdAt: "2024-12-04T10:00:00Z",
        subtasks: [
          {
            title: "Add installation instructions",
            deadlineTime: "11:00",
            priority: "High"
          },
          {
            title: "Add usage examples",
            deadlineTime: "12:00",
            priority: "Medium"
          }
        ]
      }
    ]
  }
];
