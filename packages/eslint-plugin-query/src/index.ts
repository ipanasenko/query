import { rules } from './rules'
import type { ESLint, Linter } from 'eslint'
import type { RuleModule } from '@typescript-eslint/utils/ts-eslint'

type RuleKey = keyof typeof rules
type FullRuleName = `@tanstack/query/${RuleKey}`

interface Plugin extends Omit<ESLint.Plugin, 'rules'> {
  rules: Record<RuleKey, RuleModule<any, any, any>>
  configs: {
    recommended: ESLint.ConfigData
    'flat/recommended': Array<Linter.FlatConfig>
  }
}

const plugin: Plugin = {
  meta: {
    name: '@tanstack/eslint-plugin-query',
  },
  configs: {} as Plugin['configs'],
  rules,
}

const recommendedConfig: Record<FullRuleName, Linter.StringSeverity> = {
  '@tanstack/query/exhaustive-deps': 'error',
  '@tanstack/query/no-rest-destructuring': 'warn',
  '@tanstack/query/stable-query-client': 'error',
  '@tanstack/query/no-unstable-deps': 'error',
  '@tanstack/query/infinite-query-property-order': 'error',
}

const strictConfig = Object.keys(rules).reduce((config, ruleKey) => {
  config[`@tanstack/query/${ruleKey as RuleKey}`] = 'error'
  return config
}, {} as Record<FullRuleName, 'error'>)

// Assign configs here so we can reference `plugin`
Object.assign(plugin.configs, {
  recommended: {
    plugins: ['@tanstack/query'],
    rules: recommendedConfig,
  },
  'flat/recommended': [
    {
      plugins: {
        '@tanstack/query': plugin,
      },
      rules: recommendedConfig,
    },
  ],
  strict: {
    plugins: ['@tanstack/query'],
    rules: strictConfig,
  },
  'flat/strict': [
    {
      plugins: {
        '@tanstack/query': plugin,
      },
      rules: strictConfig,
    },
  ],
})

export default plugin
