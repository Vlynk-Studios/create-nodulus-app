import { askPrompts } from './prompts.js'
import { generateProject } from './generator.js'

try {
  const choices = await askPrompts()
  await generateProject(choices)
} catch (err) {
  // Error is already handled internally in generator.ts with s.stop()
  // but we throw to ensure exit with code 1 if anything fails
  process.exit(1)
}
