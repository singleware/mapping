/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import * as Class from '@singleware/class';
import * as Types from '../types';
/**
 * Date helper class.
 */
export declare class ISODate extends Class.Null {
    /**
     * Try to converts the specified value to a new ISO date object.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date object when the conversion was successful, otherwise returns the given value.
     */
    static Object<T>(value: T | T[], type: Types.Cast): (T | Date) | (T | Date)[];
    /**
     * Try to converts the specified value to a new ISO date integer.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date integer when the conversion was successful, otherwise returns the given value.
     */
    static Integer<T>(value: T | T[], type: Types.Cast): (T | number) | (T | number)[];
    /**
     * Try to converts the specified value to a new ISO date string.
     * @param value Casting value.
     * @param type Casting type.
     * @returns Returns the ISO date string when the conversion was successful, otherwise returns the given value.
     */
    static String<T>(value: T | T[], type: Types.Cast): (T | string) | (T | string)[];
}
