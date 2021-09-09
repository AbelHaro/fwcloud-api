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

import { Column, Entity, getRepository, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IPObj } from "../../ipobj/IPObj";
import { Mark } from "../../ipobj/Mark";
import Model from "../../Model";
import { RoutingRuleToInterface } from "../routing-rule-to-interface/routing-rule-to-interface.model";
import { RoutingTable } from "../routing-table/routing-table.model";
import { RoutingGroup } from "../routing-group/routing-group.model";
import { Interface } from "../../interface/Interface";
import db from "../../../database/database-manager";
import { RoutingRuleToOpenVPNPrefix } from "./routing-rule-to-openvpn-prefix.model";
import { RoutingRuleToOpenVPN } from "./routing-rule-to-openvpn.model";
import { RoutingRuleToIPObjGroup } from "./routing-rule-to-ipobj-group.model";
import { RoutingRuleToIPObj } from "./routing-rule-to-ipobj.model";
import { RoutingRuleToMark } from "./routing-rule-to-mark.model";

const tableName: string = 'routing_r';

@Entity(tableName)
export class RoutingRule extends Model {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: Boolean
    })
    active: boolean;

    @Column()
    comment: string;

    @Column({
        type: Number
    })
    rule_order: number;

    @Column()
    style: string;

    @Column({
        name: 'group'
    })
    routingGroupId: number;

    @ManyToOne(type => RoutingGroup, routingGroup => routingGroup.routingRules)
    @JoinColumn({
        name: 'group'
    })
    routingGroup: RoutingGroup;

    @Column({
        name: 'routing_table'
    })
    routingTableId: number;
    
    @ManyToOne(type => RoutingTable, routingTable => routingTable.routingRules)
    @JoinColumn({
        name: 'routing_table'
    })
    routingTable: RoutingTable;

    @OneToMany(type => RoutingRuleToInterface, routingRuleToInterface => routingRuleToInterface.routingRule)
	@JoinTable({
		name: 'routing_r__interface',
		joinColumn: { name: 'rule'},
		inverseJoinColumn: { name: 'mark'}
	})
    routingRuleToInterfaces: RoutingRuleToInterface[]

    @OneToMany(() => RoutingRuleToMark, model => model.routingRule, {
        cascade: true,
    })
    routingRuleToMarks: RoutingRuleToMark[];

    @OneToMany(() => RoutingRuleToIPObj, model => model.routingRule, {
        cascade: true,
    })
    routingRuleToIPObjs: RoutingRuleToIPObj[];

    @OneToMany(() => RoutingRuleToIPObjGroup, model => model.routingRule, {
        cascade: true,
    })
    routingRuleToIPObjGroups: RoutingRuleToIPObjGroup[];
    
    @OneToMany(() => RoutingRuleToOpenVPNPrefix, model => model.routingRule, {
        cascade: true,
    })
    routingRuleToOpenVPNPrefixes: RoutingRuleToOpenVPNPrefix[];
    
    @OneToMany(() => RoutingRuleToOpenVPN, model => model.routingRule, {
        cascade: true,
    })
    routingRuleToOpenVPNs: RoutingRuleToOpenVPN[];
    
    public getTableName(): string {
        return tableName;
    }

    public static async getRoutingRuleWhichLastAddressInHost(ipobjId: number, type: number, fwcloud:number): Promise<RoutingRule[]> {
        const routingRuleToIPObjs: RoutingRuleToIPObj[] = await getRepository(RoutingRuleToIPObj).createQueryBuilder('routingRuleToIPObj')
            .innerJoin('routingRuleToIPObj.ipObj', 'ipobj')
            .innerJoin('ipobj.hosts', 'interfaceIPObj')
            .innerJoin('routingRuleToIPObj.routingRule', 'rule')
            .innerJoin('interfaceIPObj.hostInterface', 'interface')
            .innerJoin('interface.ipObjs', 'intIPObj')
            .innerJoin('rule.routingTable', 'table')
            .innerJoin('table.firewall', 'firewall')
            .where('intIPObj.id = :ipobjId', {ipobjId})
            .andWhere('firewall.fwCloudId = :fwcloud', {fwcloud})  
            .getMany()

        let result: RoutingRuleToIPObj[] = [];
        
        for (let routingRuleToIPObj of routingRuleToIPObjs) {
            let addrs: any = await Interface.getHostAddr(db.getQuery(), routingRuleToIPObj.ipObjId);

            // Count the amount of interface address with the same IP version of the rule.
            let n = 0;
            let id = 0;
            for (let addr of addrs) {
                n++;
                if (n === 1) id = addr.id;
            }

            // We are the last IP address in the host used in a firewall rule.
            if (n === 1 && ipobjId === id)
                result.push(routingRuleToIPObj);
        }

        if (result.length === 0) {
            return [];
        }

        return await getRepository(RoutingRule).createQueryBuilder('routing_rule')
            .distinct()
            .addSelect('firewall.id', 'firewall_id')
            .addSelect('firewall.name', 'firewall_name')
            .addSelect('cluster.id', 'cluster_id')
            .addSelect('cluster.name', 'cluster_name')
            .innerJoin('routing_rule.routingRuleToIPObjs', 'routingRuleToIPObjs')
            .innerJoin('routingRuleToIPObjs.ipObj', 'ipobj')
            .innerJoin('ipobj.hosts', 'InterfaceIPObj')
            .innerJoin('InterfaceIPObj.hostInterface', 'interface')
            .innerJoin('routing_rule.routingTable', 'table')
            .innerJoin('table.firewall', 'firewall')
            .leftJoin('firewall.cluster', 'cluster')
            .where('routing_rule.id IN (:ids)', {ids: result.map(item => item.routingRuleId).join(", ")})
            .getRawMany();
    }

    public static async getRoutingRuleWhichLastAddressInHostInGroup(ipobjId: number, type: number, fwcloud:number): Promise<RoutingRule[]> {
        const interfaces: Interface [] = await getRepository(Interface).createQueryBuilder('interface')
            .select('interface.id')
            .innerJoinAndSelect('interface.ipObjs', 'ipobj', 'ipobj.id = :id', {id: ipobjId})
            .innerJoin('interface.hosts', 'InterfaceIPObj')
            .innerJoin('InterfaceIPObj.hostIPObj', 'host')
            .innerJoin('host.ipObjToIPObjGroups', 'IPObjToIPObjGroup')
            .innerJoin('IPObjToIPObjGroup.ipObjGroup', 'group')
            .innerJoin('group.routingRuleToIPObjGroups', 'routingRuleToIPObjGroups')
            .innerJoin('routingRuleToIPObjGroups.routingRule', 'rule')
            .innerJoinAndSelect('rule.routingTable', 'table')
            .innerJoin('table.firewall', 'firewall')
            .innerJoin('firewall.fwCloud', 'fwcloud', 'fwcloud.id = :fwcloud', {fwcloud})
            .getMany();

        const uniqueInterfaces: Interface[] = [];
        for(let _interface of interfaces) {
            let addresses: IPObj[] = await Interface.getInterfaceAddr(db.getQuery(), _interface.id);

            if (addresses.length === 1 && addresses[0].id === ipobjId) {
                uniqueInterfaces.push(_interface);
            }
        }

        if (uniqueInterfaces.length === 0) {
            return [];
        }

        return await getRepository(RoutingRule).createQueryBuilder('routing_rule')
            .addSelect('firewall.id', 'firewall_id').addSelect('firewall.name', 'firewall_name')
            .addSelect('cluster.id', 'cluster_id').addSelect('cluster.name', 'cluster_name')
            .innerJoin('routing_rule.routingRuleToIPObjs', 'routingRuleToIPObjs')
            .innerJoin('routingRuleToIPObjs.ipObj', 'ipobj')
            .innerJoin('ipobj.hosts', 'InterfaceIPObj')
            .innerJoin('InterfaceIPObj.hostInterface', 'interface')
            .innerJoin('routing_rule.routingTable', 'table')
            .innerJoin('table.firewall', 'firewall')
            .leftJoin('firewall.cluster', 'cluster')
            .where(`interface.id IN (${uniqueInterfaces.map(item => item.id).join(',')})`)
            .getRawMany();
    }

}