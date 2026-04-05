import { intro, text, select, cancel, isCancel, group } from '@clack/prompts'

export interface UserChoices {
  projectName: string
  language: 'ts' | 'js'
}

export function validateProjectName(value: string | undefined) {
  if (!value) return 'Name is required'
  if (!/^[a-z0-9-]+$/.test(value)) {
    return 'Name must be lowercase with only letters, numbers, or hyphens'
  }
}

export async function askPrompts(): Promise<UserChoices> {
  intro('create-nodulus-app v1.0.0')

  const project = await group(
    {
      projectName: () =>
        text({
          message: 'What is the name of your project?',
          placeholder: 'my-api',
          validate: validateProjectName,
        }),
      language: () =>
        select({
          message: 'Pick a language',
          options: [
            { value: 'ts', label: 'TypeScript', hint: 'recommended' },
            { value: 'js', label: 'JavaScript' },
          ],
          initialValue: 'ts' as const,
        }),
    },
    {
      onCancel: () => {
        cancel('Operation cancelled.')
        process.exit(0)
      },
    }
  )

  return project as UserChoices
}
