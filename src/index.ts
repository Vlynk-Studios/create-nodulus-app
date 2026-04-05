import { outro } from '@clack/prompts'
import { askPrompts } from './prompts.js'

async function main() {
  const choices = await askPrompts()
  
  console.log('\nChoices summary:')
  console.log(JSON.stringify(choices, null, 2))

  outro('Ready to generate!')
}

main().catch((err) => {
  console.error('An error occurred:', err)
  process.exit(1)
})
