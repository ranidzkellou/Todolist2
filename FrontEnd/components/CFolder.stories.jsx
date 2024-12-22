import React from 'react';
import CFolder from './CFolder';

export default {
  title: 'Components/CFolder',
  component: CFolder,
};

const Template = (args) => <CFolder {...args} />;

export const Default = Template.bind({});
Default.args = {};
