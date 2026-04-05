import picocolors from 'picocolors'
import { askPrompts } from './prompts.js'
import { generateProject } from './generator.js'

async function main() {
  const choices = await askPrompts()
  await generateProject(choices)
}

main().catch((err) => {
  console.error(picocolors.red('\nAn error occurred:'), err instanceof Error ? err.message : err)
  process.exit(1)
})
