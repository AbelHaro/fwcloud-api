/*
    Copyright 2019 SOLTECSIS SOLUCIONES TECNOLOGICAS, SLU
    https://soltecsis.com
    info@soltecsis.com


    This file is part of FWCloud (https://fwcloud.net).

    FWCloud is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    FWCloud is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with FWCloud.  If not, see <https://www.gnu.org/licenses/>.
*/

import * as process from "process";
import * as yargs from "yargs";
import { Connection, ConnectionOptionsReader, createConnection, MigrationExecutor, QueryRunner } from "typeorm";


/**
 * Runs migration command.
 */
export class MigrationResetCommand implements yargs.CommandModule {

    command = "migration:reset";
    describe = "Reset all migrations";

    builder(args: yargs.Argv) {
        return args.option("connection", {
            alias: "c",
            default: "default",
            describe: "Name of the connection on which run a query."
        })
            .option("config", {
                alias: "f",
                default: "ormconfig",
                describe: "Name of the file with connection configuration."
            });
    }

    async handler(args: yargs.Arguments) {
        let connection: Connection | undefined = undefined;

        try {
            const connectionOptionsReader = new ConnectionOptionsReader({
                root: process.cwd(),
                configName: args.config as any
            });

            const connectionOptions = await connectionOptionsReader.get(args.connection as any);

            Object.assign(connectionOptions, {
                subscribers: [],
                synchronize: false,
                migrationsRun: false,
                dropSchema: false,
                logging: ["query", "error", "schema"]
            });

            const options = { transaction: "all" as "all" | "none" | "each" };

            const connection = await createConnection(connectionOptions);

            const migrationExecutor = new MigrationExecutor(connection, connection.createQueryRunner());
            const executedMigrations = await migrationExecutor.getExecutedMigrations();

            for (let i: number = 0; i < executedMigrations.length; i++) {
                await connection.undoLastMigration(options);
            }

            await connection.close();

        } catch (err) {
            if (connection) await (connection as Connection).close();

            console.log("Error during migration show:");
            console.error(err);
            process.exit(1);
        }
    }

}