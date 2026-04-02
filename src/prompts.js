// src/prompts.js

export const FRAMEWORK_OPTIONS = {
  mobile: [
    { name: 'Expo + React Native + NativeWind', value: 'expo-rn-nativewind' },
    { name: 'Flutter', value: 'flutter' }
  ],
  web: [
    { name: 'React + Vite + Tailwind CSS', value: 'react-vite-tailwind' },
    { name: 'Next.js', value: 'nextjs' },
    { name: 'Nuxt.js', value: 'nuxtjs' },
    { name: 'Svelte', value: 'svelte' }
  ],
  backend: [
    { name: 'Python + FastAPI + SQLAlchemy', value: 'fastapi-sqlalchemy' },
    { name: 'Python + Django', value: 'django' },
    { name: 'Node.js + Express', value: 'express' },
    { name: 'Node.js + NestJS', value: 'nestjs' }
  ]
};

export const INTEGRATION_OPTIONS = [
  { name: 'GitHub Actions (CI/CD)', value: 'cicd', checked: true },
  { name: 'AWS (EC2, RDS, S3, CloudFront)', value: 'aws' },
  { name: 'Asana', value: 'asana' },
  { name: 'n8n (automation)', value: 'n8n' }
];

export const PLUGIN_OPTIONS = [
  { name: 'Superpowers (skills & workflows)', value: 'superpowers', checked: true },
  { name: 'GSD (Get Shit Done)', value: 'gsd', checked: true },
  { name: 'ui-ux-pro-max (design intelligence)', value: 'uiUxProMax', checked: true }
];

export function buildPromptConfig() {
  return [
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
      default: 'my-app',
      validate: (input) => {
        if (!input.trim()) return 'Project name is required';
        if (/[^a-zA-Z0-9-_]/.test(input)) return 'Use only letters, numbers, hyphens, underscores';
        return true;
      }
    },
    {
      type: 'checkbox',
      name: 'modules',
      message: 'Select your modules:',
      choices: [
        { name: 'Mobile', value: 'mobile' },
        { name: 'Web', value: 'web' },
        { name: 'Backend', value: 'backend' }
      ],
      validate: (input) => input.length > 0 ? true : 'Select at least one module'
    },
    {
      type: 'list',
      name: 'mobileFramework',
      message: 'Mobile framework:',
      choices: FRAMEWORK_OPTIONS.mobile,
      when: (answers) => answers.modules.includes('mobile')
    },
    {
      type: 'list',
      name: 'webFramework',
      message: 'Web framework:',
      choices: FRAMEWORK_OPTIONS.web,
      when: (answers) => answers.modules.includes('web')
    },
    {
      type: 'list',
      name: 'backendFramework',
      message: 'Backend framework:',
      choices: FRAMEWORK_OPTIONS.backend,
      when: (answers) => answers.modules.includes('backend')
    },
    {
      type: 'checkbox',
      name: 'integrations',
      message: 'Integrations:',
      choices: INTEGRATION_OPTIONS
    },
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Install plugins:',
      choices: PLUGIN_OPTIONS
    }
  ];
}

export function normalizeAnswers(answers) {
  const hasMobile = answers.modules.includes('mobile');
  const hasWeb = answers.modules.includes('web');
  const hasBackend = answers.modules.includes('backend');

  return {
    projectName: answers.projectName,
    modules: {
      mobile: hasMobile,
      web: hasWeb,
      backend: hasBackend
    },
    mobileFramework: answers.mobileFramework || null,
    webFramework: answers.webFramework || null,
    backendFramework: answers.backendFramework || null,
    integrations: {
      cicd: answers.integrations.includes('cicd'),
      aws: answers.integrations.includes('aws'),
      asana: answers.integrations.includes('asana'),
      n8n: answers.integrations.includes('n8n')
    },
    plugins: {
      superpowers: answers.plugins.includes('superpowers'),
      gsd: answers.plugins.includes('gsd'),
      uiUxProMax: answers.plugins.includes('uiUxProMax')
    }
  };
}
