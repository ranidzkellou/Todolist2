import Topbar from "../components/Topbar";

export default {
  title: 'Components/Topbar', // Story title, organized by folders
  component: Topbar,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <Topbar {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
