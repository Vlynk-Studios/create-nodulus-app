import { describe, it, expect } from 'vitest'
import { validateProjectName } from '../src/prompts.js'

describe('validateProjectName', () => {
  it('should reject an empty string', () => {
    expect(validateProjectName('')).toBe('Name is required')
    expect(validateProjectName(undefined)).toBe('Name is required')
  })

  it('should reject uppercase names', () => {
    expect(validateProjectName('MyApp')).toBe('Name must be lowercase with only letters, numbers, or hyphens')
  })

  it('should reject names with spaces', () => {
    expect(validateProjectName('my app')).toBe('Name must be lowercase with only letters, numbers, or hyphens')
  })

  it('should reject names with special characters', () => {
    expect(validateProjectName('my_app')).toBe('Name must be lowercase with only letters, numbers, or hyphens')
    expect(validateProjectName('my.app')).toBe('Name must be lowercase with only letters, numbers, or hyphens')
    expect(validateProjectName('my$app')).toBe('Name must be lowercase with only letters, numbers, or hyphens')
  })

  it('should accept valid names', () => {
    expect(validateProjectName('my-api')).toBeUndefined()
    expect(validateProjectName('users')).toBeUndefined()
    expect(validateProjectName('my-project-123')).toBeUndefined()
  })
})
