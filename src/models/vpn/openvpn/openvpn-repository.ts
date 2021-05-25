/*!
    Copyright 2021 SOLTECSIS SOLUCIONES TECNOLOGICAS, SLU
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

import { Repository } from "../../../database/repository";
import { OpenVPN } from "./OpenVPN";
import { EntityRepository, SelectQueryBuilder } from "typeorm";

@EntityRepository(OpenVPN)
export class OpenVPNRepository extends Repository<OpenVPN> {
  public async markAllAsUninstalled(): Promise<void> {
    await this.createQueryBuilder().update(OpenVPN)
      .set({
          status: 1,
          installed_at: null
      }).execute();
  }

  getOpenVPNInRoutes_ForGrid(fwcloud: number, firewall: number, routingTable: number): SelectQueryBuilder<OpenVPN> {
    return this.createQueryBuilder("vpn")
      .select("vpn.id","id").addSelect("crt.cn","name").addSelect("311","type")
      .addSelect("firewall.id","firewall_id").addSelect("firewall.name","firewall_name")
      .addSelect("cluster.id","cluster_id").addSelect("cluster.name","cluster_name")
      .addSelect("route.id","route_id")
      .innerJoin("vpn.routes", "route")
      .innerJoin("route.routingTable", "table")
      .innerJoin("table.firewall", "firewall")
      .innerJoin("firewall.fwCloud", "fwcloud")
      .leftJoin("firewall.cluster", "cluster")
      .innerJoin("vpn.crt", "crt")
      .where("table.id = :routingTable", {routingTable})
      .andWhere("firewall.id = :firewall", {firewall: firewall}) 
      .andWhere("fwcloud.id = :fwcloud", {fwcloud: fwcloud});
  }    
}