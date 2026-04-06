import picocolors from 'picocolors'
import { askPrompts } from './prompts.js'
import { generateProject } from './generator.js'

try {
  const choices = await askPrompts()
  await generateProject(choices)
} catch (err) {
  if (err instanceof Error) {
    console.error(picocolors.red(`✗ ${err.message}`))
  }
  process.exit(1)
}
