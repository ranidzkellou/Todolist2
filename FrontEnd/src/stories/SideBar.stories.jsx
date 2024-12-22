import Sidebar from '../components/SideBar';

export default {
  title: 'Components/Sidebar', // Story title, organized by folders
  component: Sidebar,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <Sidebar {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
