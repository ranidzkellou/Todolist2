import MaincontentDash from "../components/MaincontentDash";

export default {
  title: 'Components/MaincontentDash', 
  component: MaincontentDash,        
  tags: ['autodocs'],             
};

// Template for rendering the component in stories
const Template = (args) => <MaincontentDash {...args} />;

// Default story
export const Default = Template.bind({});
Default.args = {}; 
