import TimelineSection from '../components/CFolder'; // Adjust the import path if necessary

// Default export with metadata for Storybook
export default {
  title: 'Components/TimelineSection', // Name in the sidebar of Storybook
  component: TimelineSection,          // The component we're testing
};

// Template function for creating story variations
const Template = (args) => <TimelineSection {...args} />;

// Create the default story for the TimelineSection
export const Default = Template.bind({});
Default.args = {};

// You can add more story variations here, for example, the expanded state
export const Expanded = Template.bind({});
Expanded.args = {
  isExpanded: true, // The section starts expanded
};
