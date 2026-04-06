import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { generateProject } from '../src/generator.js'
import { existsSync, readFileSync, rmSync, mkdtempSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

describe('Generator', () => {
  let tempDir: string

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'nodulus-test-'))
    vi.spyOn(process, 'cwd').mockReturnValue(tempDir)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should generate correct file structure for TypeScript', async () => {
    const choices = { projectName: 'ts-project', language: 'ts' as const }
    await generateProject(choices)

    const projectRoot = join(tempDir, 'ts-project')

    // Root files
    expect(existsSync(join(projectRoot, 'package.json'))).toBe(true)
    expect(existsSync(join(projectRoot, 'tsconfig.json'))).toBe(true)
    expect(existsSync(join(projectRoot, 'nodulus.config.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, '.gitignore'))).toBe(true)
    expect(existsSync(join(projectRoot, 'README.md'))).toBe(true)
    
    // Core files (now relocated to src/)
    expect(existsSync(join(projectRoot, 'src/app.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, 'src/modules/users/index.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, 'src/modules/users/users.service.ts'))).toBe(true)
    expect(existsSync(join(projectRoot, 'src/modules/users/users.routes.ts'))).toBe(true)

    // Content interpolation
    const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'))
    expect(pkg.name).toBe('ts-project')

    const readme = readFileSync(join(projectRoot, 'README.md'), 'utf-8')
    expect(readme).toContain('# ts-project')
  })

  it('should generate correct file structure for JavaScript', async () => {
    const choices = { projectName: 'js-project', language: 'js' as const }
    await generateProject(choices)

    const projectRoot = join(tempDir, 'js-project')

    // Root files
    expect(existsSync(join(projectRoot, 'package.json'))).toBe(true)
    expect(existsSync(join(projectRoot, 'tsconfig.json'))).toBe(false)
    expect(existsSync(join(projectRoot, 'nodulus.config.js'))).toBe(true)
    expect(existsSync(join(projectRoot, '.gitignore'))).toBe(true)
    expect(existsSync(join(projectRoot, 'README.md'))).toBe(true)
    
    // Core files (now relocated to src/)
    expect(existsSync(join(projectRoot, 'src/app.js'))).toBe(true)
    expect(existsSync(join(projectRoot, 'src/modules/users/index.js'))).toBe(true)

    // Content interpolation
    const pkg = JSON.parse(readFileSync(join(projectRoot, 'package.json'), 'utf-8'))
    expect(pkg.name).toBe('js-project')
  })

  it('should throw error if directory already exists', async () => {
    const choices = { projectName: 'existing-project', language: 'ts' as const }
    const projectPath = join(tempDir, 'existing-project')
    mkdirSync(projectPath) // Create the folder with that exact name

    await expect(generateProject(choices)).rejects.toThrow('Directory "existing-project" already exists.')
  })
})
