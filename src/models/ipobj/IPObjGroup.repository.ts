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

import { EntityRepository, SelectQueryBuilder } from "typeorm";
import { Repository } from "../../database/repository";
import { ValidEntities } from "./IPObj.repository";
import { IPObjGroup } from "./IPObjGroup";

@EntityRepository(IPObjGroup)
export class IPObjGroupRepository extends Repository<IPObjGroup> {

 getIpobjGroupsInRouting_ForGrid(entity: ValidEntities, fwcloud: number, firewall: number, routingTable?: number): SelectQueryBuilder<IPObjGroup> {
    let q = this.createQueryBuilder("ipobjGroup")
      .select("ipobjGroup.id","id").addSelect("ipobjGroup.name","name").addSelect("ipobjGroup.type","type")
      .addSelect("firewall.id","firewall_id").addSelect("firewall.name","firewall_name")
      .addSelect("cluster.id","cluster_id").addSelect("cluster.name","cluster_name")
      .addSelect(`${entity}.id`,"entityId")
      .innerJoin(`ipobjGroup.${entity==='route'?'routes':'routingRules'}`, `${entity}`)
      .innerJoin(`${entity}.routingTable`, "table")
      .innerJoin("table.firewall", "firewall")
      .innerJoin("firewall.fwCloud", "fwcloud")
      .leftJoin("firewall.cluster", "cluster")
      .where("fwcloud.id = :fwcloud", {fwcloud: fwcloud})
      .andWhere("firewall.id = :firewall", {firewall: firewall});

    if (routingTable) q = q.andWhere("table.id = :routingTable", {routingTable});

    return q;
  }    
}