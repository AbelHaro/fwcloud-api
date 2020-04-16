import { Snapshot } from "../../snapshots/snapshot";
import { NotFoundException } from "../../fonaments/exceptions/not-found-exception";
import { Progress } from "../../fonaments/http/progress/progress";
import { SnapshotData } from "../../snapshots/snapshot-data";
import { Task } from "../../fonaments/http/progress/task";
import { DatabaseDataImporter } from "./database-data-importer";
import { FwCloud } from "../../models/fwcloud/FwCloud";
import { ExporterResult } from "../exporter/exporter-result";

export class Importer {
    protected _fwcloudId: number = null;

    public async import(path: string): Promise<FwCloud> { 
        const snapshot: Snapshot = await Snapshot.load(path);
        const progress: Progress<Snapshot> = new Progress<Snapshot>(snapshot);

        const fwCloud = await this.importDatabaseData(snapshot.data);

        return fwCloud;
    }

    public importDatabaseData(data: SnapshotData): Promise<FwCloud> {
        const databaseDataImporter: DatabaseDataImporter = new DatabaseDataImporter(new ExporterResult().fromSnapshotData(data));
        return databaseDataImporter.import();
    }
}