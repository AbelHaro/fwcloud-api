import { getMetadataArgsStorage } from "typeorm"
import { ColumnMetadataArgs } from "typeorm/metadata-args/ColumnMetadataArgs"
import Model from "../../models/Model";
import { FwCloudExporter } from "./fwcloud-exporter";
import { SnapshotData } from "../snapshot-data";


export abstract class EntityExporter<T extends Model> {
    protected _entity: Function;
    protected _instance: T;

    protected _ignoreProperties = [];

    private _exporters = {
        FwCloud: FwCloudExporter
    }

    protected setInstance(instance: T){
        this._instance = instance;
        this._entity = instance.constructor;
    };

    protected getEntityColumns(): any {
        return getMetadataArgsStorage().columns.filter((column: ColumnMetadataArgs) => {
            return column.target === this._entity
        })
    }

    public async abstract export(): Promise<SnapshotData>;

    public exportedEntity<T>(): Partial<T> {
        const result = {};
        const propertyReferences: Array<ColumnMetadataArgs> = this.getEntityColumns();

        for(let i = 0; i < propertyReferences.length; i++) {
            const propertyName: string = propertyReferences[i].propertyName;

            if (this._ignoreProperties.indexOf(propertyName) < 0) {
                result[propertyName] = this._instance.hasOwnProperty(propertyName) ?
                this._instance[propertyName] : null;
            }
        }

        return result;
    }
}