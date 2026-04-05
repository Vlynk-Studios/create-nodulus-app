import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spinner, outro } from '@clack/prompts'
import picocolors from 'picocolors'
import type { UserChoices } from './prompts.js'

/**
 * Resuelve la ruta absoluta al directorio de templates según el lenguaje.
 * Se asume que el archivo compilado estará en dist/index.js y los 
 * templates en dist/templates/
 */
export function resolveTemplatesDir(language: 'ts' | 'js'): string {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  
  return join(__dirname, 'templates', language)
}

/**
 * Reemplaza todas las ocurrencias de {{key}} con vars[key] en el contenido provisto.
 */
export function interpolate(content: string, vars: Record<string, string>): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return vars[key] || match
  })
}

/**
 * Lee un template, aplica interpolación y lo escribe en el destino.
 * Maneja el renombrado de .template y gitignore.template.
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

  // Asegurar que el directorio de destino existe
  mkdirSync(dirname(finalDest), { recursive: true })

  writeFileSync(finalDest, interpolated)
}

/**
 * Crea la estructura de directorios base para el nuevo proyecto.
 */
export function createDirectoryStructure(projectPath: string): void {
  mkdirSync(join(projectPath, 'src/modules/users'), { recursive: true })
}

/**
 * Función principal que orquestra la generación del proyecto.
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

    // Recorrer recursivamente templates/[language] y copiar cada archivo
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
