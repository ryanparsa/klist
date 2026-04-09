/**
 * Validates the parsed data model before writing the JSON output.
 * Returns an array of error strings. Empty array = valid.
 */
export function validate({ items, configs }) {
  const errors = []

  // --- Build ID sets ---
  const itemIds = new Set()
  for (const item of items) {
    if (itemIds.has(item.id)) {
      errors.push(`Duplicate item ID: ${item.id}`)
    }
    itemIds.add(item.id)
  }

  const configIds = new Set()
  for (const config of configs) {
    if (configIds.has(config.id)) {
      errors.push(`Duplicate config ID: ${config.id}`)
    }
    configIds.add(config.id)
  }

  // --- Validate item references ---
  for (const config of configs) {
    for (const id of config.items.required) {
      if (!itemIds.has(id)) {
        errors.push(`[${config.id}] items.required references unknown item: ${id}`)
      }
    }
    for (const id of config.items.suggested) {
      if (!itemIds.has(id)) {
        errors.push(`[${config.id}] items.suggested references unknown item: ${id}`)
      }
    }

    // Same ID must not appear in both lists
    const reqSet = new Set(config.items.required)
    for (const id of config.items.suggested) {
      if (reqSet.has(id)) {
        errors.push(`[${config.id}] item ${id} appears in both required and suggested`)
      }
    }
  }

  // --- Required and Optional field checks on items ---
  const REQUIRED_ITEM_FIELDS = ['id', 'title', 'stage', 'description', 'tags', 'references']
  const VALID_STAGES = ['draft', 'active', 'deprecated']
  for (const item of items) {
    for (const field of REQUIRED_ITEM_FIELDS) {
      if (item[field] == null) {
        errors.push(`[${item.id}] missing required field: ${field}`)
      }
    }
    if (!Array.isArray(item.references) || item.references.length === 0) {
      errors.push(`[${item.id}] must have at least one reference`)
    } else {
      for (const ref of item.references) {
        if (!ref.title) errors.push(`[${item.id}] reference missing title`)
        if (!ref.url) errors.push(`[${item.id}] reference missing url`)
      }
    }

    if (item.stage && !VALID_STAGES.includes(item.stage)) {
      errors.push(`[${item.id}] invalid stage "${item.stage}" — must be one of: ${VALID_STAGES.join(', ')}`)
    }

    if (item.mitigations != null) {
      if (!Array.isArray(item.mitigations)) {
        errors.push(`[${item.id}] mitigations must be an array`)
      } else {
        for (const m of item.mitigations) {
          if (typeof m !== 'string') errors.push(`[${item.id}] mitigations items must be strings`)
        }
      }
    }

    if (item.tools != null) {
      if (!Array.isArray(item.tools)) {
        errors.push(`[${item.id}] tools must be an array`)
      } else {
        for (const tool of item.tools) {
          if (!tool.title) errors.push(`[${item.id}] tool missing title`)
          if (!tool.url) errors.push(`[${item.id}] tool missing url`)
        }
      }
    }
  }

  // --- Required field checks on configs ---
  const REQUIRED_CONFIG_FIELDS = ['id', 'label', 'type', 'items']
  const VALID_TYPES = ['baseline', 'provider', 'architecture', 'compliance']
  for (const config of configs) {
    for (const field of REQUIRED_CONFIG_FIELDS) {
      if (config[field] == null) {
        errors.push(`[${config.id}] missing required field: ${field}`)
      }
    }
    if (config.type && !VALID_TYPES.includes(config.type)) {
      errors.push(`[${config.id}] invalid type "${config.type}" — must be one of: ${VALID_TYPES.join(', ')}`)
    }
    if (!config.items?.required || !config.items?.suggested) {
      errors.push(`[${config.id}] config.items must have both required and suggested arrays`)
    }
  }

  return errors
}
