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

import db from '../../database/database-manager';
import Model from '../Model';
import { Column, PrimaryColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { logger } from '../../fonaments/abstract-application';
import { PolicyRule } from './PolicyRule';
import { Interface } from '../interface/Interface';
import { PolicyPosition } from './PolicyPosition';
import Query from '../../database/Query';
import fwcError from '../../utils/error_table';

import asyncMod from 'async';
import { PolicyRuleToIPObjInRuleData } from './PolicyRuleToIPObj';

interface PolicyRuleToInterfaceData {
  rule?: number;
  interface?: number;
  position?: number;
  position_order?: number;
  newrule?: number;
  newInterface?: number;
}

const tableName: string = 'policy_r__interface';

@Entity(tableName)
export class PolicyRuleToInterface extends Model {
  @PrimaryColumn({ name: 'rule' })
  policyRuleId: number;

  @PrimaryColumn({ name: 'interface' })
  interfaceId: number;

  @PrimaryColumn({ name: 'position' })
  policyPositionId: number;

  @Column()
  position_order: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;

  @Column()
  created_by: number;

  @Column()
  updated_by: number;

  @ManyToOne(() => Interface, (_interface) => _interface.policyRuleToInterfaces)
  @JoinColumn({
    name: 'interface',
  })
  policyRuleInterface: Interface;

  @ManyToOne(() => PolicyRule, (policyRule) => policyRule.policyRuleToInterfaces)
  @JoinColumn({
    name: 'rule',
  })
  policyRule: PolicyRule;

  @ManyToOne(() => PolicyPosition, (policyPosition) => policyPosition.policyRuleToInterfaces)
  @JoinColumn({
    name: 'position',
  })
  policyPosition: PolicyPosition;

  public getTableName(): string {
    return tableName;
  }

  //Get All policy_r__interface by policy_r
  public static getPolicy_r__interfaces_rule(
    _interface: number,
    callback: (err: Error | null, rows: Array<PolicyRuleToInterface> | null) => void,
  ) {
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'SELECT * FROM ' +
        tableName +
        ' WHERE interface = ' +
        connection.escape(_interface) +
        ' ORDER by interface_order';
      connection.query(sql, (error, rows: Array<PolicyRuleToInterface>) => {
        if (error) callback(error, null);
        else callback(null, rows);
      });
    });
  }

  //Get All policy_r__interface by policy_r
  public static getPolicy_r__interfaces_interface(
    rule: number,
    callback: (err: Error | null, rows: Array<PolicyRuleToInterface> | null) => void,
  ) {
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'SELECT * FROM ' +
        tableName +
        ' WHERE rule = ' +
        connection.escape(rule) +
        ' ORDER by interface_order';
      connection.query(sql, (error, rows: Array<PolicyRuleToInterface>) => {
        if (error) callback(error, null);
        else callback(null, rows);
      });
    });
  }

  //Get policy_r__interface by  rule and  interface
  public static getPolicy_r__interface(
    _interface: number,
    rule: number,
    callback: (err: Error | null, rows: Array<PolicyRuleToInterface> | null) => void,
  ) {
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'SELECT * FROM ' +
        tableName +
        ' WHERE rule = ' +
        connection.escape(rule) +
        ' AND interface = ' +
        connection.escape(_interface);
      connection.query(sql, (error, row: Array<PolicyRuleToInterface>) => {
        if (error) callback(error, null);
        else callback(null, row);
      });
    });
  }

  //Add new policy_r__interface
  public static insertPolicy_r__interface(
    idfirewall: number,
    policy_r__interfaceData: PolicyRuleToInterfaceData,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      //Check if IPOBJ TYPE is ALLOWED in this Position
      this.checkInterfacePosition(
        idfirewall,
        policy_r__interfaceData.rule,
        policy_r__interfaceData.interface,
        policy_r__interfaceData.position,
        (error, allowed) => {
          if (error) return reject(error);
          if (!allowed) return reject(fwcError.NOT_ALLOWED);
          db.get((error, connection) => {
            if (error) return reject(error);
            connection.query(
              'INSERT INTO ' + tableName + ' SET ?',
              policy_r__interfaceData,
              (error, result: { affectedRows: number }) => {
                if (error) return reject(error);
                if (result.affectedRows > 0) {
                  this.OrderList(
                    policy_r__interfaceData.position_order,
                    policy_r__interfaceData.rule,
                    policy_r__interfaceData.position,
                    999999,
                    policy_r__interfaceData.interface,
                  ).catch((error) => {
                    return reject(error);
                  });

                  resolve();
                } else reject(fwcError.NOT_FOUND);
              },
            );
          });
        },
      );
    });
  }

  //Clone policy_r__interface
  public static clonePolicy_r__interface(
    policy_r__interfaceData: PolicyRuleToInterfaceData,
  ): Promise<{ result: boolean; allowed: string }> {
    return new Promise((resolve, reject) => {
      const p_interfaceData = {
        rule: policy_r__interfaceData.newrule,
        interface: policy_r__interfaceData.newInterface,
        position: policy_r__interfaceData.position,
        position_order: policy_r__interfaceData.position_order,
      };

      db.get((error, connection) => {
        if (error) reject(error);
        connection.query(
          'INSERT INTO ' + tableName + ' SET ?',
          [p_interfaceData],
          (error, result: { affectedRows: number }) => {
            if (error) {
              reject(error);
            } else {
              if (result.affectedRows > 0) {
                void this.OrderList(
                  p_interfaceData.position_order,
                  p_interfaceData.rule,
                  p_interfaceData.position,
                  999999,
                  p_interfaceData.interface,
                );

                resolve({ result: true, allowed: '1' });
              } else {
                resolve({ result: false, allowed: '1' });
              }
            }
          },
        );
      });
    });
  }

  //Duplicate policy_r__interface RULES
  public static duplicatePolicy_r__interface = (
    dbCon: Query,
    rule: number,
    new_rule: number,
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO ${tableName} (rule, interface, position,position_order)
			(SELECT ${new_rule}, interface, position, position_order
			from ${tableName} where rule=${rule} order by  position, position_order)`;
      dbCon.query(sql, (error) => {
        if (error) return reject(error);
        resolve();
      });
    });
  };

  //Update policy_r__interface
  public static updatePolicy_r__interface(
    idfirewall: number,
    rule: number,
    _interface: number,
    old_position: number,
    old_position_order: number,
    policy_r__interfaceData: PolicyRuleToInterfaceData,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    //Check if IPOBJ TYPE is ALLOWED in this Position
    this.checkInterfacePosition(
      idfirewall,
      policy_r__interfaceData.rule,
      policy_r__interfaceData.interface,
      policy_r__interfaceData.position,
      (error, data) => {
        if (error) {
          callback(error, null);
        } else {
          const allowed = data;
          if (allowed) {
            db.get((error, connection) => {
              if (error) callback(error, null);
              const sql =
                'UPDATE ' +
                tableName +
                ' SET position = ' +
                connection.escape(policy_r__interfaceData.position) +
                ',' +
                ' WHERE rule = ' +
                policy_r__interfaceData.rule +
                ' AND  interface = ' +
                policy_r__interfaceData.interface;

              connection.query(sql, (error, result: { affectedRows: number }) => {
                if (error) {
                  callback(error, null);
                } else {
                  if (result.affectedRows > 0) {
                    void this.OrderList(
                      policy_r__interfaceData.position_order,
                      rule,
                      null,
                      old_position_order,
                      _interface,
                    );
                    callback(null, { result: true });
                  } else {
                    callback(null, { result: false });
                  }
                }
              });
            });
          }
        }
      },
    );
  }

  //Update policy_r__interface POSITION AND RULE
  public static updatePolicy_r__interface_position(
    dbCon: Query,
    idfirewall: number,
    rule: number,
    _interface: number,
    old_position: number,
    old_position_order: number,
    new_rule: number,
    new_position: number,
    new_order: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      //Check if IPOBJ TYPE is ALLOWED in this Position
      this.checkInterfacePosition(
        idfirewall,
        new_rule,
        _interface,
        new_position,
        (error, allowed) => {
          if (error) return reject(error);
          if (!allowed) return reject(fwcError.NOT_FOUND);

          const sql = `UPDATE ${tableName} SET position=${dbCon.escape(new_position)},
                    rule=${dbCon.escape(new_rule)}, position_order=${dbCon.escape(new_order)}
                    WHERE rule=${rule} AND interface=${_interface} AND position=${dbCon.escape(old_position)}`;
          dbCon.query(sql, (error, result: { affectedRows: number }) => {
            if (error) return reject(error);
            if (result.affectedRows > 0) {
              //Order New position
              void this.OrderList(new_order, new_rule, new_position, 999999, _interface);
              //Order OLD position
              void this.OrderList(999999, rule, old_position, old_position_order, _interface);

              resolve();
            } else reject(fwcError.NOT_FOUND);
          });
        },
      );
    });
  }

  //Update ORDER policy_r__interface
  public static updatePolicy_r__interface_order(
    rule: number,
    _interface: number,
    position: number,
    old_order: number,
    new_order: number,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    void this.OrderList(new_order, rule, position, old_order, _interface);
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'UPDATE ' +
        tableName +
        ' SET ' +
        ' position_order = ' +
        connection.escape(new_order) +
        ' ' +
        ' WHERE rule = ' +
        rule +
        ' AND  interface = ' +
        _interface;

      connection.query(sql, (error) => {
        if (error) {
          callback(error, null);
        } else {
          callback(null, { result: true });
        }
      });
    });
  }

  private static OrderList(
    new_order: number,
    rule: number,
    position: number,
    old_order: number,
    _interface: number,
  ) {
    return new Promise((resolve, reject) => {
      let increment = '+1';
      let order1 = new_order;
      let order2 = old_order;
      if (new_order > old_order) {
        increment = '-1';
        order1 = old_order;
        order2 = new_order;
      }

      logger().debug(
        '---> ORDENANDO RULE INTERFACE: ' +
          rule +
          ' POSITION: ' +
          position +
          '  OLD_ORDER: ' +
          old_order +
          '  NEW_ORDER: ' +
          new_order,
      );

      db.get((error, connection) => {
        if (error) {
          reject(error);
        }

        const sql =
          'UPDATE ' +
          tableName +
          ' SET ' +
          'position_order = position_order' +
          increment +
          ' WHERE rule = ' +
          connection.escape(rule) +
          ' AND position=' +
          connection.escape(position) +
          ' AND position_order>=' +
          order1 +
          ' AND position_order<=' +
          order2 +
          ' AND interface<>' +
          _interface;
        logger().debug(sql);
        connection.query(sql, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      });
    });
  }

  //Check if a object (type) can be inserted in a position type
  private static checkInterfacePosition(
    idfirewall: number,
    rule: number,
    id: number,
    position: number,
    callback: (error: Error | null, allowed: number) => void,
  ) {
    db.get((error, connection) => {
      if (error) return callback(null, 0);

      const sql = `select A.type from ipobj_type__policy_position A
			inner join interface I on A.type=I.interface_type
			inner join policy_position P on P.id=A.position
			WHERE I.id=${id} AND A.position=${position} AND I.firewall=${idfirewall}`;
      connection.query(sql, (error, rows: Array<{ type: number }>) => {
        if (error) return callback(error, null);
        callback(null, rows.length > 0 ? 1 : 0);
      });
    });
  }

  //Remove policy_r__interface with id to remove
  public static deletePolicy_r__interface(
    dbCon: Query,
    rule: number,
    _interface: number,
    position: number,
    old_order: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const sqlExists = `SELECT * FROM ${tableName} 
                WHERE rule=${dbCon.escape(rule)} AND  interface=${dbCon.escape(_interface)}
                AND position=${dbCon.escape(position)}`;
      dbCon.query(sqlExists, (error, row: Array<PolicyRuleToInterface>) => {
        //If exists Id from policy_r__interface to remove
        if (row) {
          db.get((error, connection) => {
            const sql = `DELETE FROM ${tableName}
                            WHERE rule=${connection.escape(rule).toString()} 
                            AND interface=${connection.escape(_interface).toString()} 
                            AND position=${connection.escape(position).toString()}`;
            connection.query(sql, (error, result: { affectedRows: number }) => {
              if (error) return reject(error);
              if (result.affectedRows > 0) {
                void this.OrderList(999999, rule, position, old_order, _interface);
                resolve();
              } else reject(fwcError.NOT_FOUND);
            });
          });
        } else reject(fwcError.NOT_FOUND);
      });
    });
  }

  //Remove policy_r__interface with id to remove
  public static deletePolicy_r__All(
    rule: number,
    callback: (err: Error | null, res: { result: boolean; msg?: string } | null) => Promise<void>,
  ) {
    db.get((error, connection) => {
      if (error) void callback(error, null);
      const sqlExists = 'SELECT * FROM ' + tableName + ' WHERE rule = ' + connection.escape(rule);
      connection.query(sqlExists, (error, row: Array<PolicyRuleToInterface>) => {
        //If exists Id from policy_r__interface to remove
        if (row) {
          logger().debug('DELETING INTERFACES FROM RULE: ' + rule);
          db.get((error, connection) => {
            const sql = 'DELETE FROM ' + tableName + ' WHERE rule = ' + connection.escape(rule);
            connection.query(sql, (error, result: { affectedRows: number }) => {
              if (error) {
                logger().debug(error);
                void callback(error, null);
              } else {
                if (result.affectedRows > 0) {
                  void callback(null, { result: true, msg: 'deleted' });
                } else {
                  void callback(null, { result: false });
                }
              }
            });
          });
        } else {
          void callback(null, { result: false });
        }
      });
    });
  }

  //Order policy_r__interfaces Position
  public static orderPolicyPosition(
    rule: number,
    position: number,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    logger().debug('DENTRO ORDER   Rule: ' + rule + '  Position: ' + position);

    db.get((error, connection) => {
      if (error) callback(error, null);
      const sqlPos =
        'SELECT * FROM ' +
        tableName +
        ' WHERE rule = ' +
        connection.escape(rule) +
        ' AND position= ' +
        connection.escape(position) +
        ' order by position_order';
      //logger().debug(sqlPos);
      connection.query(sqlPos, (error, rows: Array<PolicyRuleToInterface>) => {
        if (rows.length > 0) {
          let order = 0;
          asyncMod.map(
            rows,
            (row, callback1: () => void) => {
              order++;
              db.get((error, connection) => {
                const sql =
                  'UPDATE ' +
                  tableName +
                  ' SET position_order=' +
                  order +
                  ' WHERE rule = ' +
                  connection.escape(row.policyRuleId) +
                  ' AND position=' +
                  connection.escape(row.policyPositionId) +
                  ' AND interface=' +
                  connection.escape(row.interfaceId);
                //logger().debug(sql);
                connection.query(sql, (error) => {
                  if (error) {
                    callback1();
                  } else {
                    callback1();
                  }
                });
              });
            }, //Fin de bucle
            function () {
              callback(null, { result: true });
            },
          );
        } else {
          callback(null, { result: false });
        }
      });
    });
  }

  //Order policy_r__interfaces Position
  public static orderPolicy(
    rule: number,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sqlRule =
        'SELECT * FROM ' +
        tableName +
        ' WHERE rule = ' +
        connection.escape(rule) +
        ' order by position, position_order';
      //logger().debug(sqlRule);
      connection.query(sqlRule, (error, rows: Array<PolicyRuleToInterface>) => {
        if (rows.length > 0) {
          let order = 0;
          let prev_position = 0;
          asyncMod.map(
            rows,
            (row, callback1: () => void) => {
              const position = row.policyPositionId;
              if (position !== prev_position) {
                order = 1;
                prev_position = position;
              } else order++;

              db.get((error, connection) => {
                const sql =
                  'UPDATE ' +
                  tableName +
                  ' SET position_order=' +
                  order +
                  ' WHERE rule = ' +
                  connection.escape(row.policyRuleId) +
                  ' AND position=' +
                  connection.escape(row.policyPositionId) +
                  ' AND interface=' +
                  connection.escape(row.interfaceId);
                //logger().debug(sql);
                connection.query(sql, (error) => {
                  if (error) {
                    callback1();
                  } else {
                    callback1();
                  }
                });
              });
            }, //Fin de bucle
            function () {
              callback(null, { result: true });
            },
          );
        } else {
          callback(null, { result: false });
        }
      });
    });
  }

  //Order policy_r__interfaces Position
  public static orderAllPolicy(
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sqlRule = 'SELECT * FROM ' + tableName + ' ORDER by rule,position, position_order';
      //logger().debug(sqlRule);
      connection.query(sqlRule, (error, rows: Array<PolicyRuleToInterface>) => {
        if (rows.length > 0) {
          let order = 0;
          let prev_rule = 0;
          let prev_position = 0;
          asyncMod.map(
            rows,
            (row, callback1: () => void) => {
              const position = row.policyPositionId;
              const rule = row.policyRuleId;
              if (position !== prev_position || rule !== prev_rule) {
                order = 1;
                prev_rule = rule;
                prev_position = position;
              } else order++;

              db.get((error, connection) => {
                const sql =
                  'UPDATE ' +
                  tableName +
                  ' SET position_order=' +
                  order +
                  ' WHERE rule = ' +
                  connection.escape(row.policyRuleId) +
                  ' AND position=' +
                  connection.escape(row.policyRuleId) +
                  ' AND interface=' +
                  connection.escape(row.interfaceId);
                //logger().debug(sql);
                connection.query(sql, (error) => {
                  if (error) {
                    callback1();
                  } else {
                    callback1();
                  }
                });
              });
            }, //Fin de bucle
            function () {
              logger().debug('FIN De BUCLE');
              callback(null, { result: true });
            },
          );
        } else {
          callback(null, { result: false });
        }
      });
    });
  }

  //check if INTERFACE Exists in any rule
  public static checkInterfaceInRule(
    _interface: number,
    type: number,
    fwcloud: number,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    logger().debug(
      'CHECK DELETING interface I POSITIONS:' +
        _interface +
        ' Type:' +
        type +
        '  fwcloud:' +
        fwcloud,
    );
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'SELECT count(*) as n FROM ' +
        tableName +
        ' O INNER JOIN policy_r R on R.id=O.rule ' +
        ' INNER JOIN firewall F on F.id=R.firewall ' +
        ' INNER JOIN fwcloud C on C.id=F.fwcloud ' +
        ' inner join interface I on I.id=O.interface ' +
        ' WHERE I.id=' +
        connection.escape(_interface) +
        ' AND I.interface_type=' +
        connection.escape(type) +
        ' AND C.id=' +
        connection.escape(fwcloud);
      //logger().debug(sql);
      connection.query(sql, (error, rows: Array<{ n: number }>) => {
        if (!error) {
          if (rows.length > 0) {
            if (rows[0].n > 0) {
              logger().debug(
                'ALERT DELETING interface IN RULE:' +
                  _interface +
                  ' type: ' +
                  type +
                  ' fwcloud:' +
                  fwcloud +
                  ' --> FOUND IN ' +
                  rows[0].n +
                  ' RULES',
              );
              callback(null, { result: true });
            } else {
              callback(null, { result: false });
            }
          } else {
            callback(null, { result: false });
          }
        } else callback(null, { result: false });
      });
    });
  }

  //check if HOST ALL INTERFACEs Exists in any rule
  public static checkHostAllInterfacesInRule(
    ipobj_host: number,
    fwcloud: number,
    callback: (err: Error | null, res: { result: boolean } | null) => void,
  ) {
    logger().debug(
      'CHECK DELETING HOST ALL interfaces I POSITIONS:' + ipobj_host + '  fwcloud:' + fwcloud,
    );
    db.get((error, connection) => {
      if (error) callback(error, null);
      const sql =
        'SELECT count(*) as n FROM ' +
        tableName +
        ' O ' +
        ' inner join interface__ipobj J on J.interface=O.interface  ' +
        ' INNER JOIN policy_r R on R.id=O.rule ' +
        ' INNER JOIN firewall F on F.id=R.firewall ' +
        ' inner join fwcloud C on C.id=F.fwcloud ' +
        ' WHERE J.ipobj=' +
        connection.escape(ipobj_host) +
        ' AND C.id=' +
        connection.escape(fwcloud);
      //logger().debug(sql);
      connection.query(sql, (error, rows: Array<{ n: number }>) => {
        if (!error) {
          if (rows.length > 0) {
            if (rows[0].n > 0) {
              logger().debug(
                'ALERT DELETING HOST ALL interfaces IN RULE:' +
                  ipobj_host +
                  ' fwcloud:' +
                  fwcloud +
                  ' --> FOUND IN ' +
                  rows[0].n +
                  ' RULES',
              );
              callback(null, { result: true });
            } else {
              callback(null, { result: false });
            }
          } else {
            callback(null, { result: false });
          }
        } else callback(null, { result: false });
      });
    });
  }

  //search if INTERFACE Exists in any rule I POSITIONS
  public static SearchInterfaceInRules = (
    _interface: number,
    type: string,
    fwcloud: number,
    firewall: number,
    diff_firewall: number,
  ): Promise<Array<PolicyRuleToIPObjInRuleData>> => {
    return new Promise((resolve, reject) => {
      db.get((error, connection) => {
        if (error) return reject(error);
        let sql = '';
        if (firewall === null) {
          //Search interfaces in all Firewalls from Cloud
          sql = `SELECT O.interface obj_id,I.name obj_name, I.interface_type obj_type_id,T.type obj_type_name,
					C.id cloud_id, C.name cloud_name, R.firewall firewall_id, F.name firewall_name ,O.rule rule_id, R.rule_order,R.type rule_type,
					PT.name rule_type_name,O.position rule_position_id,  P.name rule_position_name,R.comment rule_comment,
					F.cluster as cluster_id, IF(F.cluster is null,null,(select name from cluster where id=F.cluster)) as cluster_name
					FROM policy_r__interface O
					INNER JOIN policy_r R on R.id=O.rule
					INNER JOIN firewall F on F.id=R.firewall
					INNEr JOIN interface I on I.id=O.interface
					inner join ipobj_type T on T.id=I.interface_type
					inner join policy_position P on P.id=O.position
					inner join policy_type PT on PT.id=R.type
					inner join fwcloud C on C.id=F.fwcloud
					WHERE I.id=${_interface} AND I.interface_type=${type} AND C.id=${fwcloud}`;
          if (diff_firewall) sql += ` AND F.id<>${diff_firewall}`;
        } else {
          //Search interfaces only in Firewall interface
          sql = `SELECT O.interface obj_id,I.name obj_name, I.interface_type obj_type_id,T.type obj_type_name,
					C.id cloud_id, C.name cloud_name, R.firewall firewall_id, F.name firewall_name ,O.rule rule_id, R.rule_order,R.type rule_type,
					PT.name rule_type_name,O.position rule_position_id,  P.name rule_position_name,R.comment rule_comment,
					F.cluster as cluster_id, IF(F.cluster is null,null,(select name from cluster where id=F.cluster)) as cluster_name
					FROM policy_r__interface O
					INNER JOIN policy_r R on R.id=O.rule
					INNER JOIN firewall F on F.id=R.firewall
					INNEr JOIN interface I on I.id=O.interface
					inner join ipobj_type T on T.id=I.interface_type
					inner join policy_position P on P.id=O.position
					inner join policy_type PT on PT.id=R.type
					inner join fwcloud C on C.id=F.fwcloud
					WHERE I.id=${_interface} AND I.interface_type=${type} AND C.id=${fwcloud}`;
          if (diff_firewall) sql += ` AND F.id<>${diff_firewall}`;
          else sql += ` AND F.id=${firewall}`;
        }
        connection.query(sql, (error, rows: Array<PolicyRuleToIPObjInRuleData>) => {
          if (error) return reject(error);
          resolve(rows);
        });
      });
    });
  };

  public static interfaceAlreadyInRulePosition = (
    dbCon: Query,
    fwcloud: number,
    firewall: number,
    rule: number,
    position: number,
    _interface: number | string,
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT O.rule FROM ${tableName} O 
                INNER JOIN policy_r R on R.id=O.rule
                INNER JOIN firewall F on F.id=R.firewall
                INNER JOIN fwcloud C on C.id=F.fwcloud
                WHERE O.rule=${dbCon.escape(rule)} AND O.position=${dbCon.escape(position)} AND O.interface=${dbCon.escape(_interface)} 
                AND F.id=${dbCon.escape(firewall)} AND C.id=${dbCon.escape(fwcloud)}`;

      dbCon.query(sql, (error, rows: Array<{ rule: number }>) => {
        if (error) return reject(error);
        resolve(rows.length === 0 ? false : true);
      });
    });
  };
}
