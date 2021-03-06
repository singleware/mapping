/*!
 * Copyright (C) 2018-2020 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Types from './types';
import * as Columns from './columns';
import * as Filters from './filters';
/**
 * Schema class.
 */
export declare class Schema extends Class.Null {
    /**
     * Map of storages.
     */
    private static storages;
    /**
     * Set the specified format validation into the given column schema and property descriptor.
     * @param target Model target.
     * @param schema Column schema.
     * @param validator Data validator.
     * @param format Data format.
     * @param descriptor Property descriptor.
     * @returns Returns the wrapped property descriptor.
     */
    private static setValidation;
    /**
     * Freeze any column in the specified row schema.
     * @param row Row schema.
     * @returns Returns a new row schema.
     */
    private static freezeRowColumns;
    /**
     * Assign all properties to the storage that corresponds to the specified model type.
     * @param model Model type.
     * @param properties Storage properties.
     * @returns Returns the assigned storage object.
     */
    private static assignToStorage;
    /**
     * Find in all storages that corresponds to the specified model type using the given callback.
     * @param model Model type.
     * @param callback Callback filter.
     * @returns Returns the found value or undefined when no value was found.
     */
    private static findInStorages;
    /**
     * Assign all properties to the column that corresponds to the specified model type and column name.
     * @param model Model type.
     * @param type Column type.
     * @param name Column name.
     * @param properties Column properties.
     * @returns Returns the assigned column schema.
     * @throws Throws an error when a column with the same name and another type already exists.
     */
    private static assignToColumn;
    /**
     * Assign all properties to a real or virtual column that corresponds to the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @param properties Column properties.
     * @returns Returns the assigned column schema.
     * @throws Throws an error when the column does not exists yet.
     */
    private static assignToRVColumn;
    /**
     * Determines whether or not the specified model input is a valid entity model.
     * @param input Model input.
     * @returns Returns true when it's valid, false otherwise.
     */
    static isEntity<E extends Types.Entity>(input?: Types.ModelInput<E>): boolean;
    /**
     * Try to get the merged real and virtual row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the real and virtual row schema or undefined when the model is invalid.
     */
    static tryRows(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Any> | undefined;
    /**
     * Get the merged real and virtual row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the real and virtual row schema.
     * @throws Throws an error when the model type isn't valid.
     */
    static getRows(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Any>;
    /**
     * Try to get the real row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the real row schema or undefined when the model is invalid.
     */
    static tryRealRow(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Real> | undefined;
    /**
     * Gets the real row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the real row schema.
     * @throws Throws an error when the model type isn't valid.
     */
    static getRealRow(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Real>;
    /**
     * Try to get the virtual row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the virtual row schema.
     * @throws Throws an error when the model type isn't valid.
     */
    static tryVirtualRow(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Virtual> | undefined;
    /**
     * Gets the virtual row schema from the specified model type and fields.
     * @param model Model type.
     * @param fields Fields to be selected.
     * @returns Returns the virtual row schema.
     * @throws Throws an error when the model type isn't valid.
     */
    static getVirtualRow(model: Types.ModelClass, ...fields: string[]): Columns.ReadonlyRow<Columns.Virtual>;
    /**
     * Try to get the real or virtual column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the real or virtual column schema or undefined when the column doesn't found.
     */
    static tryColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Any<E>> | undefined;
    /**
     * Gets the real or virtual column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the real or virtual column schema.
     * @throws Throws an error when the model type isn't valid or the specified column was not found.
     */
    static getColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Any<E>>;
    /**
     * Try to get the real column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the real column schema or undefined when the column doesn't found.
     */
    static tryRealColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Real<E>> | undefined;
    /**
     * Gets the real column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the real column schema.
     * @throws Throws an error when the model type isn't valid or the specified column was not found.
     */
    static getRealColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Real<E>>;
    /**
     * Try to get the virtual column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the virtual column schema or undefined when the column doesn't found.
     */
    static tryVirtualColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Virtual<E>> | undefined;
    /**
     * Gets the virtual column schema from the specified model type and column name.
     * @param model Model type.
     * @param name Column name.
     * @returns Returns the virtual column schema.
     * @throws Throws an error when the model type isn't valid or the specified column was not found.
     */
    static getVirtualColumn<E extends Types.Entity>(model: Types.ModelClass<E>, name: string): Readonly<Columns.Virtual<E>>;
    /**
     * Try to get the primary column schema from the specified model type.
     * @param model Model type.
     * @returns Returns the column schema or undefined when the column does not exists.
     */
    static tryPrimaryColumn<E extends Types.Entity>(model: Types.ModelClass<E>): Readonly<Columns.Real<E>> | undefined;
    /**
     * Gets the primary column schema from the specified model type.
     * @param model Model type.
     * @returns Returns the column schema.
     * @throws Throws an error when the entity model isn't valid or the primary column was not defined
     */
    static getPrimaryColumn<E extends Types.Entity>(model: Types.ModelClass<E>): Readonly<Columns.Real<E>>;
    /**
     * Gets the storage name from the specified model type.
     * @param model Model type.
     * @returns Returns the storage name.
     * @throws Throws an error when the model type isn't valid.
     */
    static getStorageName(model: Types.ModelClass): string;
    /**
     * Decorates the specified class to be an entity model.
     * @param name Storage name.
     * @returns Returns the decorator method.
     */
    static Entity(name: string): ClassDecorator;
    /**
     * Decorates the specified property to be referenced by another property name.
     * @param name Alias name.
     * @returns Returns the decorator method.
     */
    static Alias(name: string): Types.ModelDecorator;
    /**
     * Decorates the specified property to convert its input and output value.
     * @param callback Caster callback.
     * @returns Returns the decorator method.
     */
    static Convert(callback: Types.ModelCaster): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a required column.
     * @returns Returns the decorator method.
     */
    static Required(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a hidden column.
     * @returns Returns the decorator method.
     */
    static Hidden(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a read-only column.
     * @returns Returns the decorator method.
     * @throws Throws an error when the column is already write-only.
     */
    static ReadOnly(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a write-only column.
     * @returns Returns the decorator method.
     * @throws Throws an error when the column is already read-only.
     */
    static WriteOnly(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a virtual column of a foreign entity.
     * @param foreign Foreign column name.
     * @param model Foreign entity model.
     * @param local Local id column name.
     * @param match Column matching filter.
     * @param fields Fields to be selected.
     * @returns Returns the decorator method.
     */
    static Join(foreign: string, model: Types.ModelInput, local: string, match?: Filters.Match, fields?: string[]): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a virtual column of a foreign entity list.
     * @param foreign Foreign column name.
     * @param model Foreign entity model.
     * @param local Local id column name.
     * @param query Column query filter.
     * @param fields Fields to be selected.
     * @returns Returns the decorator method.
     */
    static JoinAll(foreign: string, model: Types.ModelInput, local: string, query?: Filters.Query, fields?: string[]): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a primary column.
     * @returns Returns the decorator method.
     */
    static Primary(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be an Id column.
     * @returns Returns the decorator method.
     */
    static Id(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a column that accepts null values.
     * @returns Returns the decorator method.
     */
    static Null(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a binary column.
     * @returns Returns the decorator method.
     */
    static Binary(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a boolean column.
     * @returns Returns the decorator method.
     */
    static Boolean(): Types.ModelDecorator;
    /**
     * Decorates the specified property to be an integer column.
     * @param minimum Minimum value.
     * @param maximum Maximum value.
     * @returns Returns the decorator method.
     */
    static Integer(minimum?: number, maximum?: number): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a decimal column.
     * @param minimum Minimum value.
     * @param maximum Maximum value.
     * @returns Returns the decorator method.
     */
    static Decimal(minimum?: number, maximum?: number): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a number column.
     * @param minimum Minimum value.
     * @param maximum Maximum value.
     * @returns Returns the decorator method.
     */
    static Number(minimum?: number, maximum?: number): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a string column.
     * @param minimum Minimum length.
     * @param maximum Maximum length.
     * @returns Returns the decorator method.
     */
    static String(minimum?: number, maximum?: number): Types.ModelDecorator;
    /**
     * Decorates the specified property to be an enumeration column.
     * @param values Enumeration values.
     * @returns Returns the decorator method.
     */
    static Enumeration(values: Types.ModelValues): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a string pattern column.
     * @param pattern Pattern expression.
     * @param name Pattern name.
     * @returns Returns the decorator method.
     */
    static Pattern(pattern: RegExp, name?: string): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a timestamp column.
     * @param minimum Minimum date.
     * @param maximum Maximum date.
     * @returns Returns the decorator method.
     */
    static Timestamp(minimum?: Date, maximum?: Date): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a date column.
     * @param minimum Minimum date.
     * @param maximum Maximum date.
     * @returns Returns the decorator method.
     */
    static Date(minimum?: Date, maximum?: Date): Types.ModelDecorator;
    /**
     * Decorates the specified property to be an array column.
     * @param model Model type.
     * @param fields Fields to select.
     * @param unique Determines whether or not the array items must be unique.
     * @param minimum Minimum items.
     * @param maximum Maximum items.
     * @returns Returns the decorator method.
     */
    static Array(model: Types.ModelInput, fields?: string[], unique?: boolean, minimum?: number, maximum?: number): Types.ModelDecorator;
    /**
     * Decorates the specified property to be a map column.
     * @param model Model type.
     * @param fields Fields to select.
     * @returns Returns the decorator method.
     */
    static Map(model: Types.ModelInput, fields?: string[]): Types.ModelDecorator;
    /**
     * Decorates the specified property to be an object column.
     * @param model Model type.
     * @param fields Fields to select.
     * @returns Returns the decorator method.
     */
    static Object(model: Types.ModelInput, fields?: string[]): Types.ModelDecorator;
}
