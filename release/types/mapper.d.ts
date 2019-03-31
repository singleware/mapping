import * as Class from '@singleware/class';
import * as Types from './types';
import * as Statements from './statements';
import { Driver } from './driver';
/**
 * Generic data mapper class.
 */
export declare class Mapper<E extends Types.Entity> extends Class.Null {
    /**
     * Entity model.
     */
    private model;
    /**
     * Data driver.
     */
    private driver;
    /**
     * Insert the specified entity list into the storage using a custom model type.
     * @param model Model type.
     * @param entities Entity list.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    protected insertManyEx<T extends Types.Entity>(model: Types.Model<T>, entities: T[], views?: string[]): Promise<any[]>;
    /**
     * Insert the specified entity list into the storage.
     * @param entities Entity list.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the id list of all inserted entities.
     */
    protected insertMany(entities: E[], views?: string[]): Promise<any[]>;
    /**
     * Insert the specified entity into the storage using a custom model type.
     * @param model Model type.
     * @param entity Entity data.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the id of the inserted entry.
     */
    protected insertEx<T extends Types.Entity>(model: Types.Model<T>, entity: T, views?: string[]): Promise<any>;
    /**
     * Insert the specified entity into the storage.
     * @param entity Entity data.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the id of the inserted entity.
     */
    protected insert(entity: E, views?: string[]): Promise<any>;
    /**
     * Find all corresponding entity in the storage.
     * @param filter Field filter.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the list of entities found.
     */
    protected find(filter: Statements.Filter, views?: string[]): Promise<E[]>;
    /**
     * Find the entity that corresponds to the specified entity id.
     * @param id Entity id.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the entity found or undefined when the entity was not found.
     */
    protected findById(id: any, views?: string[]): Promise<E | undefined>;
    /**
     * Update all entities that corresponds to the specified match using a custom model type.
     * @param model Model type.
     * @param match Matching fields.
     * @param entity Entity data to be updated.
     * @param views View modes.
     * @returns Returns a promise to get the number of updated entities.
     */
    protected updateEx<T extends Types.Entity>(model: Types.Model<T>, match: Statements.Match, entity: T, views?: string[]): Promise<number>;
    /**
     * Update all entities that corresponds to the specified match.
     * @param match Matching fields.
     * @param entity Entity data to be updated.
     * @param views View modes, use Types.View.ALL to see all fields.
     * @returns Returns a promise to get the number of updated entities.
     */
    protected update(match: Statements.Match, entity: Types.Entity, views?: string[]): Promise<number>;
    /**
     * Update the entity that corresponds to the specified id using a custom model type.
     * @param model Model type.
     * @param id Entity id.
     * @param entity Entity data to be updated.
     * @param views View modes.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    protected updateByIdEx<T extends Types.Entity>(model: Types.Model<T>, id: any, entity: T, views?: string[]): Promise<boolean>;
    /**
     * Update the entity that corresponds to the specified id.
     * @param id Entity id.
     * @param entity Entity data to be updated.
     * @param views View modes.
     * @returns Returns a promise to get the true when the entity has been updated or false otherwise.
     */
    protected updateById(id: any, entity: Types.Entity, views?: string[]): Promise<boolean>;
    /**
     * Delete all entities that corresponds to the specified match.
     * @param match Matching fields.
     * @return Returns a promise to get the number of deleted entities.
     */
    protected delete(match: Statements.Match): Promise<number>;
    /**
     * Delete the entity that corresponds to the specified entity id.
     * @param id Entity id.
     * @return Returns a promise to get the true when the entity has been deleted or false otherwise.
     */
    protected deleteById(id: any): Promise<boolean>;
    /**
     * Count all corresponding entities from the storage.
     * @param filter Field filter.
     * @param views View modes.
     * @returns Returns a promise to get the total amount of found entities.
     */
    protected count(filter: Statements.Filter, views?: string[]): Promise<number>;
    /**
     * Generate a new normalized entity based on the specified input data.
     * @param input Input data.
     * @returns Returns the new normalized entity data.
     */
    protected normalize(input: E): E;
    /**
     * Normalize all entities in the specified input list.
     * @param list Input list.
     * @returns Returns the list of normalized entities.
     */
    protected normalizeAll(...list: E[]): E[];
    /**
     * Normalize all entities in the specified input list to a new map of entities.
     * @param list Input list.
     * @returns Returns the map of normalized entities.
     */
    protected normalizeAsMap(...list: E[]): E;
    /**
     * Default constructor.
     * @param driver Data driver.
     * @param model Entity model.
     * @throws Throws an error when the model isn't a valid entity.
     */
    constructor(driver: Driver, model: Types.Model<E>);
}
