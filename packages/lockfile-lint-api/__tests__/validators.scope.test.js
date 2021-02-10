const ValidatorHost = require('../src/validators/ValidateScope')

describe('Validator: Scope', () => {
  it('validator should throw an error when provided a string', () => {
    expect(() => new ValidatorHost('ss')).toThrowError()
  })

  it('validator should throw an error when provided null', () => {
    expect(() => new ValidatorHost(null)).toThrowError()
  })

  it('validator should throw an error when provided array', () => {
    expect(() => new ValidatorHost(['a'])).toThrowError()
  })

  it('validator should throw an error instantiated with no value', () => {
    expect(() => new ValidatorHost()).toThrowError()
  })

  it('should fail if host is not valid for host', () => {
    const mockedPackages = {
      '@enterprise-internal/internal-dependency': {
        resolved:
          'https://registry.npmjs.org/@enterprise-internal/internal-dependency/-/internal-dependency-4.0.1.tgz'
      },
      '@babel/code-frame': {
        resolved: 'https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(
      validator.validate({'@enterprise-internal': 'registry.enterprise-internal.int'})
    ).toEqual({
      type: 'error',
      errors: [
        {
          message:
            'detected invalid scope host for package: @enterprise-internal/internal-dependency\n    expected: registry.enterprise-internal.int\n    actual: registry.npmjs.org\n',
          package: '@enterprise-internal/internal-dependency'
        }
      ]
    })
  })

  it('should pass', () => {
    const mockedPackages = {
      '@enterprise-internal/internal-dependency': {
        resolved:
          'https://registry.enterprise-internal.int/@enterprise-internal/internal-dependency/-/internal-dependency-4.0.1.tgz'
      },
      '@babel/code-frame': {
        resolved: 'https://registry.yarnpkg.com/@babel/code-frame/-/code-frame-7.0.0.tgz'
      },
      meow: {
        resolved: 'https://registry.npmjs.org/meow/-/meow-4.0.1.tgz'
      },
      '@babel/generator': {
        resolved: 'https://registry.npmjs.org/@babel/generator/-/generator-7.4.4.tgz'
      }
    }

    const validator = new ValidatorHost({packages: mockedPackages})
    expect(
      validator.validate({'@enterprise-internal': 'registry.enterprise-internal.int'})
    ).toEqual({
      type: 'success',
      errors: []
    })
  })
})
