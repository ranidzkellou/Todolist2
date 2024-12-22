export default (plop) => {
    plop.setGenerator('component', {
      description: 'Create a new component with a story',
      prompts: [
        {
          type: 'input',
          name: 'name',
          message: 'What is the component name?',
        },
      ],
      actions: [
        {
          type: 'add',
          path: 'components/{{pascalCase name}}.jsx',
          templateFile: 'plop-templates/Component.jsx.hbs',
        },
        {
          type: 'add',
          path: 'components/{{pascalCase name}}.stories.jsx',
          templateFile: 'plop-templates/Component.stories.jsx.hbs',
        },
      ],
    });
  };
  