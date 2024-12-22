import Dashboard from '../pages/Dashboard'

export default {
  title: 'Pages/Dashboard', // Story title, organized by folders
  component: Dashboard,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <Dashboard {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
