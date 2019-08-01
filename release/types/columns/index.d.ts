/*!
 * Copyright (C) 2018-2019 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
export { Base } from './base';
export { Real } from './real';
export { Virtual } from './virtual';
import * as Types from '../types';
import { Base } from './base';
import { Real } from './real';
import { Virtual } from './virtual';
/**
 * Type declaration for map of columns base.
 */
export declare type BaseRow = Types.Map<Base>;
/**
 * Type declaration for map of real columns.
 */
export declare type RealRow = Types.Map<Real>;
/**
 * Type declaration for map of virtual columns.
 */
export declare type VirtualRow = Types.Map<Virtual>;
