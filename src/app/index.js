import BaseGenerator from 'yeoman-generator';

import getSubgeneratorOptions from './getSubgeneratorOptions';
import getSubgenerators from './getSubgenerators';

export default class Generator extends BaseGenerator {

  initializing() {
    this.config.defaults({
      app: {
        name: this.appname,
      },
    });

    const subgenerators = getSubgenerators(this);
    this.subgenerators = subgenerators;
    this.subgeneratorOptions = getSubgeneratorOptions(subgenerators);
  }

  prompting() {
    const config = this.config.getAll();

    const prompts = [
      {
        type: 'input',
        name: 'name',
        message: 'Project name (machine name)',
        default: config.app.name,
        async validate(input) {
          if (input.length > 0) {
            return true;
          }
          return 'You must specify a project name.';
        },
      },
      {
        type: 'input',
        name: 'repository',
        message: 'Repository clone URL',
        default: config.app.repository,
      },
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Plugins',
        choices: this.subgeneratorOptions,
        default: config.app.plugins,
      },
    ];

    this.prompt(prompts)
      .then((answers) => {
        this.config.set({ app: answers });

        answers.plugins.forEach((plugin) => {
          this.composeWith(this.subgenerators[plugin].resolved);
        });
      });
  }

  writing() {
    const config = this.config.getAll();

    this.fs.copyTpl(
      this.templatePath('_.gitignore'),
      this.destinationPath('_.gitignore'),
      config,
    );
  }

}
