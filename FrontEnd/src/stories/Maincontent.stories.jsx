import Maincontent from '../components/Maincontent';

export default {
  title: 'Components/Maincontent', // Story title, organized by folders
  component: Maincontent,         // The component being documented
  tags: ['autodocs'],             // Optional tags for Storybook
};

// Template for rendering the component in stories
const Template = (args) => <Maincontent {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; // No props needed for this simple example
