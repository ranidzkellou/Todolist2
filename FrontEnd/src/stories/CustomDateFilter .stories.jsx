import CustomDateFilter from '../components/CustomDateFilter ';

// Default export with metadata for Storybook
export default {
  title: 'Components/CustomDateFilter', // Name in the sidebar of Storybook
  component: CustomDateFilter,          // The component we're testing
};

// Template function for creating story variations
const Template = (args) => <CustomDateFilter {...args} />;

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
