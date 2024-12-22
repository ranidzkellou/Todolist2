import Tasks from '../pages/Tasks';

export default {
  title: 'Pages/Tasks', // Story title, organized by folders
  component: Tasks,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <Tasks {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
