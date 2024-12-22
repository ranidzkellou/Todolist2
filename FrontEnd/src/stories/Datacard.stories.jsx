import DataCard from "../components/Datacard";

// Default export with metadata for Storybook
export default {
  title: 'Components/DataCard', // Name in the sidebar of Storybook
  component: DataCard,          // The component we're testing
};

// Template function for creating story variations
const Template = (args) => <DataCard {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const Expanded = Template.bind({});
Expanded.args = {
  isExpanded: true, 
};
