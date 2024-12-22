import EditTask from '../components/EditTask'; 

// Default export with metadata for Storybook
export default {
  title: 'Components/EditTask', // Name in the sidebar of Storybook
  component: EditTask,          // The component we're testing
};

// Template function for creating story variations
const Template = (args) => <EditTask {...args} />;

// Create different stories by binding the template
export const Default = Template.bind({});
Default.args = {
  task: {
    title: 'Test Task',
    description: 'This is a test task description.',
  },
  onSave: (taskData) => alert(`Task saved: ${JSON.stringify(taskData)}`),
};

// You can add more story variations here
export const EmptyTask = Template.bind({});
EmptyTask.args = {
  task: {
    title: '',
    description: '',
  },
  onSave: (taskData) => alert(`Task saved: ${JSON.stringify(taskData)}`),
};
