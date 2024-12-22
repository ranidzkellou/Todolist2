import DashboardLayout from '../components/M_Dashboard';

export default {
  title: 'M_Page/Dashboard', // Story title, organized by folders
  component: DashboardLayout,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <DashboardLayout {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
