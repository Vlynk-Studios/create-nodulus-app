import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spinner, outro } from '@clack/prompts'
import picocolors from 'picocolors'
import type { UserChoices } from './prompts.js'

/**
 * Resolves the absolute path to the templates directory based on the language.
 * Assumes the compiled file is in dist/index.js and templates are in dist/templates/
 */
export function resolveTemplatesDir(language: 'ts' | 'js'): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  
  return join(__dirname, 'templates', language)
}

/**
 * Replaces all occurrences of {{key}} with vars[key] in the provided content.
 */
export function interpolate(content: string, vars: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] || match
  })
}

/**
 * Reads a template, applies interpolation, and writes it to the destination.
 * Handles renaming of .template and gitignore.template.
 */
export function copyTemplate(src: string, dest: string, vars: Record<string, string>): void {
  const content = readFileSync(src, 'utf-8')
  const interpolated = interpolate(content, vars)

  let finalDest = dest
  const fileName = basename(src)

  if (fileName === 'gitignore.template') {
    finalDest = join(dirname(dest), '.gitignore')
  } else if (fileName.endsWith('.template')) {
    finalDest = dest.replace('.template', '')
  }

  // Ensure destination directory exists
  mkdirSync(dirname(finalDest), { recursive: true })

  writeFileSync(finalDest, interpolated)
}

/**
 * Creates the base directory structure for the new project.
 */
export function createDirectoryStructure(projectPath: string): void {
  mkdirSync(join(projectPath, 'src/modules/users'), { recursive: true })
}

/**
 * Main function orchestrating the project generation.
 */
export async function generateProject(choices: UserChoices): Promise<void> {
  const projectPath = join(process.cwd(), choices.projectName)

  if (existsSync(projectPath)) {
    throw new Error(`Directory "${choices.projectName}" already exists.`)
  }

  const s = spinner()
  s.start('Generating project files...')

  try {
    const templatesDir = resolveTemplatesDir(choices.language)
    const vars = { projectName: choices.projectName }

    createDirectoryStructure(projectPath)

    // Recursively traverse templates/[language] and copy each file
    const files = readdirSync(templatesDir, { recursive: true }) as string[]
    
    for (const file of files) {
      const srcPath = join(templatesDir, file)
      const destPath = join(projectPath, file)

      if (statSync(srcPath).isFile()) {
        copyTemplate(srcPath, destPath, vars)
      }
    }

    s.stop('Project generated successfully!')

    outro(`Next steps:
  ${picocolors.cyan(`cd ${choices.projectName}`)}
  ${picocolors.cyan('npm install')}
  ${picocolors.cyan('npm run dev')}`)

  } catch (error) {
    s.stop('Generation failed.')
    throw error
  }
}
