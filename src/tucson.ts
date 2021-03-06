import * as camelCase from 'camelcase'
import * as moment from 'moment'

import { Config } from './config'
import { IJsonOption } from './jsonOption'
import snakeCase from './snakeCase'
import { KeyConvertType } from './types'

const converter = (convertType: KeyConvertType, key: string): string => {
  if (convertType === 'camelCase') {
    return camelCase(key)
  } else if (convertType === 'snake_case') {
    return snakeCase(key)
  }

  return key
}

export class Tucson {
  private config: Config

  constructor (config: Config) {
    this.config = config
  }

  public formed<T1, T2> (obj: T1, option: IJsonOption<T1>, instance: T2): T2 {
    if (!obj) {
      return instance
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key]

      // ignore key-value when key is included in 'exclude' list
      if (option.exclude && option.exclude.indexOf(key as keyof T1) > -1) {
        continue
      }

      // make data as form of 'Boolean' when key is included in 'exclude' list
      if (option.makeBool && option.makeBool.indexOf(key as keyof T1) > -1) {
        instance[converter(this.config.keyConvert, key)] = Boolean(value)
        continue
      }

      // make data as form of 'Date' when key is included in 'exclude' list
      if (option.makeDate && option.makeDate.indexOf(key as keyof T1) > -1) {
        if (moment(value).isValid()) {
          instance[converter(this.config.keyConvert, key)] = moment(value).toDate()
        } else {
          instance[converter(this.config.keyConvert, key)] = value
        }
        continue
      }

      instance[converter(this.config.keyConvert, key)] = value
    }

    return instance
  }
}
