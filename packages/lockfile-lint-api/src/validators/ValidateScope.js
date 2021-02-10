'use strict'

const {URL} = require('url')

module.exports = class ValidateScope {
  constructor ({packages} = {}) {
    if (typeof packages !== 'object') {
      throw new Error('expecting an object passed to validator constructor')
    }

    this.packages = packages
  }

  validate (scopeToHost) {
    if (typeof scopeToHost !== 'object') {
      throw new Error('validate method requires an object')
    }

    let validationResult = {
      type: 'success',
      errors: []
    }

    for (const [packageName, packageMetadata] of Object.entries(this.packages)) {
      if (!packageName.startsWith('@')) {
        continue
      }

      try {
        const scope = /(@.*)\//.exec(packageName)

        if (!(scope[1] in scopeToHost)) {
          continue
        }

        const scopeRegistry = scopeToHost[scope[1]]

        if (!scopeRegistry) {
          continue
        }

        const packageResolvedURL = new URL(packageMetadata.resolved)
        const isPassing = packageResolvedURL.host === scopeRegistry
        if (!isPassing) {
          validationResult.errors.push({
            message: `detected invalid scope host for package: ${packageName}\n    expected: ${scopeRegistry}\n    actual: ${
              packageResolvedURL.host
            }\n`,
            package: packageName
          })
        }
      } catch (error) {
        // do nothing
      }

      if (validationResult.errors.length !== 0) {
        validationResult.type = 'error'
      }

      return validationResult
    }
  }
}
