/*!
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

import { TableExporter } from './table-exporter';
import Model from '../../../models/Model';
import { SelectQueryBuilder } from 'typeorm';
import { RoutingRule } from '../../../models/routing/routing-rule/routing-rule.model';
import { RoutingRuleExporter } from './routing-rule.exporter';
import { RoutingRuleToOpenVPN } from '../../../models/routing/routing-rule/routing-rule-to-openvpn.model';
import { RoutingRuleToOpenVPNPrefix } from '../../../models/routing/routing-rule/routing-rule-to-openvpn-prefix.model';

export class RoutingRuleToOpenVPNPrefixExporter extends TableExporter {
  protected getEntity(): typeof Model {
    return RoutingRuleToOpenVPNPrefix;
  }

  public getFilterBuilder(
    qb: SelectQueryBuilder<any>,
    alias: string,
    fwCloudId: number,
  ): SelectQueryBuilder<any> {
    return qb.where((qb) => {
      const subquery = qb
        .subQuery()
        .from(RoutingRule, 'rule')
        .select('rule.id');

      return (
        `${alias}.routingRuleId IN` +
        new RoutingRuleExporter()
          .getFilterBuilder(subquery, 'rule', fwCloudId)
          .getQuery()
      );
    });
  }
}
