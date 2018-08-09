/**
 * Copyright (C) 2018 Silas B. Domingos
 * This source code is licensed under the MIT License as described in the file LICENSE.
 */
import { Operation } from './operation';

/**
 * Filter expression interface.
 */
export interface Expression {
  [column: string]: Operation;
}
