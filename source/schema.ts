/*
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Validator from '@singleware/types';

import * as Types from './types';
import * as Columns from './columns';

import { Statements } from '.';

/**
 * Schema helper class.
 */
@Class.Describe()
export class Schema extends Class.Null {
  /**
   * Map of entity storages.
   */
  @Class.Private()
  private static storages: WeakMap<any, Types.Storage> = new WeakMap();

  /**
   * Adds the specified format validation into the provided column schema and property descriptor.
   * @param scope Entity scope.
   * @param column Column schema.
   * @param validator Data validator.
   * @param format Data format.
   * @param descriptor Property descriptor.
   * @returns Returns the wrapped property descriptor.
   */
  @Class.Private()
  private static addValidation<E extends Types.Entity>(scope: Object, column: Columns.Real<E>, validator: Validator.Format, format: Types.Format, descriptor?: PropertyDescriptor): PropertyDescriptor {
    if (column.validations.length === 0) {
      const validation = new Validator.Common.Group(Validator.Common.Group.OR, column.validations);
      descriptor = <PropertyDescriptor>Validator.Validate(validation)(scope, column.name, descriptor);
      descriptor.enumerable = true;
    }
    column.formats.push(format);
    column.validations.push(validator);
    return <PropertyDescriptor>descriptor;
  }

  /**
   * Assign all properties into the storage that corresponds to the specified model type.
   * @param model Model type.
   * @param properties Storage properties.
   * @returns Returns the assigned storage object.
   */
  @Class.Private()
  private static assignStorage(model: Types.Model, properties?: Types.Entity): Types.Storage {
    let storage = this.storages.get(model);
    if (storage) {
      Object.assign(storage, properties);
    } else {
      storage = {
        name: model.name,
        ...properties,
        real: {},
        virtual: {}
      };
      this.storages.set(model, storage);
    }
    return storage;
  }

  /**
   * Assign all properties into the column schema that corresponds to the specified model type and column name.
   * @param model Model type.
   * @param type Column type.
   * @param name Column name.
   * @param properties Column properties.
   * @returns Returns the assigned column schema.
   * @throws Throws an error when a column with the same name and another type already exists.
   */
  @Class.Private()
  private static assignColumn(model: Types.Model, type: string, name: string, properties?: Types.Entity): Columns.Base {
    const storage = <Types.Entity>this.assignStorage(model);
    const row = storage[type];
    if (type === 'real' && name in storage.virtual) {
      throw new Error(`A virtual column named '${name}' already exists.`);
    } else if (type === 'virtual' && name in storage.real) {
      throw new Error(`A real column named '${name}' already exists.`);
    }
    if (name in row) {
      Object.assign(row[name], properties);
    } else {
      row[name] = {
        ...properties,
        type: type,
        name: name,
        views: [new RegExp(`^${name}$`)],
        formats: [],
        validations: []
      };
    }
    return row[name];
  }

  /**
   * Assign all properties into a real or virtual column schema that corresponds to the specified model type and column name.
   * @param model Model type.
   * @param name Column name.
   * @param properties Column properties.
   * @returns Returns the assigned column schema.
   * @throws Throws an error when the column does not exists yet.
   */
  @Class.Private()
  private static assignRealOrVirtualColumn(model: Types.Model, name: string, properties?: Types.Entity): Columns.Real | Columns.Virtual {
    const storage = this.assignStorage(model);
    if (name in storage.virtual) {
      Object.assign(storage.virtual[name], properties);
      return storage.real[name];
    } else if (name in storage.real) {
      Object.assign(storage.real[name], properties);
      return storage.real[name];
    } else {
      throw new Error(`There's no virtual or real '${name}' column.`);
    }
  }

  /**
   * Determines whether the specified model type is a valid entity.
   * @param model Model type.
   * @returns Returns true when the specified model is valid, false otherwise.
   */
  @Class.Public()
  public static isEntity<E extends Types.Entity>(model: Types.Model<E>): boolean {
    if (model && model.prototype) {
      return this.storages.has(model.prototype.constructor);
    }
    return false;
  }

  /**
   * Determines whether one of the views in the given list of views exists in the specified column schema.
   * @param views List of views.
   * @param column Column schema.
   * @returns Returns true when the view is valid or false otherwise.
   */
  @Class.Public()
  public static isView<E extends Types.Entity>(column: Columns.Base<E>, ...views: string[]): boolean {
    for (const view of views) {
      if (view === Types.View.ALL || column.views.some((current: RegExp) => current.test(view))) {
        return true;
      }
    }
    return false;
  }

  /**
   * Gets the real row schema from the specified model type and list of view modes.
   * @param model Model type.
   * @param views List of view modes.
   * @returns Returns the real row schema.
   * @throws Throws an error when the model type isn't valid.
   */
  @Class.Public()
  public static getRealRow(model: Types.Model, ...views: string[]): Columns.RealRow {
    const storage = this.storages.get(model.prototype.constructor);
    if (!storage) {
      throw new Error(`Invalid model type '${model.prototype.constructor.name}', unable to get the real row.`);
    }
    const row = <Columns.RealRow>{};
    for (const name in storage.real) {
      const column = <Columns.Real>{ ...storage.real[name] };
      if (this.isView(column, ...views)) {
        row[name] = Object.freeze(column);
      }
    }
    return Object.freeze(row);
  }

  /**
   * Gets the virtual row schema from the specified model type and list of view modes.
   * @param model Model type.
   * @param views List of view modes.
   * @returns Returns the virtual row schema.
   * @throws Throws an error when the model type isn't valid.
   */
  @Class.Public()
  public static getVirtualRow(model: Types.Model, ...views: string[]): Columns.VirtualRow {
    const storage = this.storages.get(model.prototype.constructor);
    if (!storage) {
      throw new Error(`Invalid model type '${model.prototype.constructor.name}', unable to get the virtual row.`);
    }
    const row = <Columns.VirtualRow>{};
    for (const name in storage.virtual) {
      const column = storage.virtual[name];
      if (this.isView(column, ...views)) {
        row[name] = Object.freeze({ ...column });
      }
    }
    return Object.freeze(row);
  }

  /**
   * Gets the real column schema from the specified model type and column name.
   * @param model Model type.
   * @param name Column name.
   * @returns Returns the real column schema.
   * @throws Throws an error when the model type isn't valid or the specified column was not found.
   */
  @Class.Public()
  public static getRealColumn<E extends Types.Entity>(model: Types.Model<E>, name: string): Columns.Real<E> {
    const storage = this.storages.get(model.prototype.constructor);
    if (!storage) {
      throw new Error(`Invalid model type '${model.prototype.constructor.name}', unable to get the specified column.`);
    }
    if (!(name in storage.real)) {
      throw new Error(`Column '${name}' does not exists in the entity '${storage.name}'.`);
    }
    return <Columns.Real<E>>Object.freeze({ ...storage.real[name] });
  }

  /**
   * Gets the primary column schema from the specified model type.
   * @param model Model type.
   * @returns Returns the column schema or undefined when the column does not exists.
   * @throws Throws an error when the entity model isn't valid or the primary column was not defined
   */
  @Class.Public()
  public static getPrimaryColumn<E extends Types.Entity>(model: Types.Model<E>): Columns.Real<E> {
    const storage = this.storages.get(model.prototype.constructor);
    if (!storage) {
      throw Error(`Invalid model type '${model.prototype.constructor}', unable to get the primary column.`);
    }
    if (!storage.primary) {
      throw Error(`Entity '${storage.name}' without primary column.`);
    }
    return this.getRealColumn(model, <string>storage.primary);
  }

  /**
   * Gets the storage name from the specified model type.
   * @param model Model type.
   * @returns Returns the storage name.
   * @throws Throws an error when the model type isn't valid.
   */
  @Class.Public()
  public static getStorage(model: Types.Model): string {
    const storage = this.storages.get(model.prototype.constructor);
    if (!storage) {
      throw Error(`Invalid model type '${model.prototype.constructor}', unable to get the storage name.`);
    }
    return storage.name;
  }

  /**
   * Decorates the specified class to be an entity model.
   * @param name Storage name.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Entity(name: string): ClassDecorator {
    return (model: any): void => {
      this.assignStorage(model.prototype.constructor, { name: name });
    };
  }

  /**
   * Decorates the specified property to be referenced by another property name.
   * @param name Alias name.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Alias(name: string): PropertyDecorator {
    return (scope: Object, property: PropertyKey): any => {
      this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { alias: name });
    };
  }

  /**
   * Decorates the specified property to be visible only in specific scenarios.
   * @param views List of views.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Views(...views: RegExp[]): PropertyDecorator {
    return (scope: Object, property: PropertyKey): any => {
      this.assignRealOrVirtualColumn(<Types.Model>scope.constructor, <string>property, { views: views });
    };
  }

  /**
   * Decorates the specified property to convert its input and output value.
   * @param callback Converter callback.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Convert(callback: Types.Converter): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      this.assignRealOrVirtualColumn(<Types.Model>scope.constructor, <string>property, { converter: callback });
    };
  }

  /**
   * Decorates the specified property to be a required column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Required(): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      this.assignRealOrVirtualColumn(<Types.Model>scope.constructor, <string>property, { required: true });
    };
  }

  /**
   * Decorates the specified property to be a hidden column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Hidden(): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      this.assignRealOrVirtualColumn(<Types.Model>scope.constructor, <string>property, { hidden: true });
    };
  }

  /**
   * Decorates the specified property to be a read-only column.
   * @returns Returns the decorator method.
   * @throws Throws an error when the column is already write-only.
   */
  @Class.Public()
  public static ReadOnly(): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      const column = this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { readOnly: true });
      if (column.writeOnly) {
        throw new Error(`Column '${property as string}' is already write-only.`);
      }
    };
  }

  /**
   * Decorates the specified property to be a write-only column.
   * @returns Returns the decorator method.
   * @throws Throws an error when the column is already read-only.
   */
  @Class.Public()
  public static WriteOnly(): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      const column = this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { writeOnly: true });
      if (column.readOnly) {
        throw new Error(`Column '${property as string}' is already read-only.`);
      }
    };
  }

  /**
   * Decorates the specified property to be a virtual column of a foreign entity.
   * @param foreign Foreign column name.
   * @param model Foreign entity model.
   * @param local Local id column name.
   * @param match Column match.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Join<E extends Types.Entity>(foreign: string, model: Types.Model<E>, local: string, match?: Statements.Match): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      const localModel = <Types.Model>scope.constructor;
      const localSchema = this.getRealColumn(localModel, local);
      const foreignSchema = this.getRealColumn(model, foreign);
      const multiple = localSchema.formats.includes(Types.Format.ARRAY);
      return this.addValidation(
        scope,
        this.assignColumn(localModel, 'virtual', <string>property, {
          local: localSchema.alias || localSchema.name,
          foreign: foreignSchema.alias || foreignSchema.name,
          multiple: multiple,
          model: model,
          filter: {
            pre: match
          }
        }),
        new Validator.Common.InstanceOf(multiple ? Array : model),
        multiple ? Types.Format.ARRAY : Types.Format.OBJECT,
        descriptor
      );
    };
  }

  /**
   * Decorates the specified property to be a virtual column of a foreign entity list.
   * @param foreign Foreign column name.
   * @param model Foreign entity model.
   * @param local Local id column name.
   * @param filter Column filter.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static JoinAll<E extends Types.Entity>(foreign: string, model: Types.Model<E>, local: string, filter?: Statements.Filter): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      const localModel = <Types.Model>scope.constructor;
      const localSchema = this.getRealColumn(localModel, local);
      const foreignSchema = this.getRealColumn(model, foreign);
      return this.addValidation(
        scope,
        this.assignColumn(localModel, 'virtual', <string>property, {
          local: localSchema.alias || localSchema.name,
          foreign: foreignSchema.alias || foreignSchema.name,
          multiple: localSchema.formats.includes(Types.Format.ARRAY),
          filter: filter,
          model: model,
          all: true
        }),
        new Validator.Common.InstanceOf(Array),
        Types.Format.ARRAY,
        descriptor
      );
    };
  }

  /**
   * Decorates the specified property to be a primary column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Primary(): PropertyDecorator {
    return (scope: Object, property: PropertyKey): void => {
      this.assignStorage(<Types.Model>scope.constructor, { primary: <string>property });
    };
  }

  /**
   * Decorates the specified property to be an Id column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Id(): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Any(), Types.Format.ID, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a column that accepts null values.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Null(): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Null(), Types.Format.NULL, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a binary column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Binary(): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Any(), Types.Format.BINARY, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a boolean column.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Boolean(): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Boolean(), Types.Format.BOOLEAN, descriptor);
    };
  }

  /**
   * Decorates the specified property to be an integer column.
   * @param minimum Minimum value.
   * @param maximum Maximum value.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Integer(minimum?: number, maximum?: number): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { minimum: minimum, maximum: maximum }), new Validator.Common.Integer(minimum, maximum), Types.Format.INTEGER, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a decimal column.
   * @param minimum Minimum value.
   * @param maximum Maximum value.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Decimal(minimum?: number, maximum?: number): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { minimum: minimum, maximum: maximum }), new Validator.Common.Decimal(minimum, maximum), Types.Format.DECIMAL, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a number column.
   * @param minimum Minimum value.
   * @param maximum Maximum value.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Number(minimum?: number, maximum?: number): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { minimum: minimum, maximum: maximum }), new Validator.Common.Number(minimum, maximum), Types.Format.NUMBER, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a string column.
   * @param minimum Minimum length.
   * @param maximum Maximum length.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static String(minimum?: number, maximum?: number): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { minimum: minimum, maximum: maximum }), new Validator.Common.String(minimum, maximum), Types.Format.STRING, descriptor);
    };
  }

  /**
   * Decorates the specified property to be an enumeration column.
   * @param values Enumeration values.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Enumeration(...values: string[]): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { values: values }), new Validator.Common.Enumeration(...values), Types.Format.ENUMERATION, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a string pattern column.
   * @param pattern Pattern expression.
   * @param name Pattern name.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Pattern(pattern: RegExp, name?: string): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { pattern: pattern }), new Validator.Common.Pattern(pattern, name), Types.Format.PATTERN, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a timestamp column.
   * @param min Minimum date.
   * @param max Maximum date.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Timestamp(min?: Date, max?: Date): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Timestamp(min, max), Types.Format.TIMESTAMP, descriptor);
    };
  }

  /**
   * Decorates the specified property to be a date column.
   * @param minimum Minimum date.
   * @param maximum Maximum date.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Date(minimum?: Date, maximum?: Date): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property), new Validator.Common.Timestamp(minimum, maximum), Types.Format.DATE, descriptor);
    };
  }

  /**
   * Decorates the specified property to be an array column.
   * @param model Model type.
   * @param unique Determines whether the items of array must be unique or not.
   * @param minimum Minimum items.
   * @param maximum Maximum items.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Array(model: Types.Model, unique?: boolean, minimum?: number, maximum?: number): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(
        scope,
        this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, {
          model: model,
          unique: unique,
          minimum: minimum,
          maximum: maximum
        }),
        new Validator.Common.InstanceOf(Array),
        Types.Format.ARRAY,
        descriptor
      );
    };
  }

  /**
   * Decorates the specified property to be a map column.
   * @param model Model type.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Map(model: Types.Model): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { model: model }), new Validator.Common.InstanceOf(Object), Types.Format.MAP, descriptor);
    };
  }

  /**
   * Decorates the specified property to be an object column.
   * @param model Model type.
   * @returns Returns the decorator method.
   */
  @Class.Public()
  public static Object(model: Types.Model): PropertyDecorator {
    return (scope: Object, property: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor => {
      return this.addValidation(scope, this.assignColumn(<Types.Model>scope.constructor, 'real', <string>property, { model: model }), new Validator.Common.InstanceOf(model), Types.Format.OBJECT, descriptor);
    };
  }
}
