import AddTask from '../components/addTask';

export default {
  title: 'Components/AddTask', // Story title, organized by folders
  component: AddTask,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <AddTask {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
