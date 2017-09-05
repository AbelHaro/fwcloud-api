var db = require('../db.js');
var async = require('async');

//create object
var policy_r__ipobjModel = {};
var tableModel = "policy_r__ipobj";

/**
 * Property Logger to manage App logs
 *
 * @property logger
 * @type log4js/app
 * 
 */
var logger = require('log4js').getLogger("app");


//Get All policy_r__ipobj by Policy_r (rule)
policy_r__ipobjModel.getPolicy_r__ipobjs = function (rule, callback) {

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');

        var sql = 'SELECT * FROM ' + tableModel + ' WHERE rule=' + connection.escape(rule) + ' ORDER BY position_order';

        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else
                callback(null, rows);
        });
    });

};

//Get All policy_r__ipobj by Policy_r (rule) and position
policy_r__ipobjModel.getPolicy_r__ipobjs_position = function (rule, position, callback) {

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');

        var sql = 'SELECT * FROM ' + tableModel + ' WHERE rule=' + connection.escape(rule) + ' AND position=' + connection.escape(position) + ' ORDER BY position_order';

        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else
                callback(null, rows);
        });
    });

};
//Get All policy_r__ipobj by Policy_r (rule) and position
policy_r__ipobjModel.getPolicy_r__ipobjs_interfaces_position = function (rule, position, callback) {

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');


        var sql = 'SELECT rule,ipobj, ipobj_g, interface, position, position_order, negate, "O" as type FROM ' + tableModel + ' WHERE rule=' + connection.escape(rule) + ' AND position=' + connection.escape(position) +
                ' UNION SELECT rule,interface,0,0,position,position_order, negate, "I" as type  from policy_r__interface ' + ' WHERE rule=' + connection.escape(rule) + ' AND position=' + connection.escape(position) +
                ' ORDER BY position_order';

        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else
                callback(null, rows);
        });
    });

};

//Get All policy_r__ipobj by Policy_r (rule) and position
policy_r__ipobjModel.getPolicy_r__ipobjs_position_data = function (rule, position, callback) {

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');

        var sql_obj = " INNER JOIN ipobj O on O.id=P.ipobj ";
        var sql = 'SELECT * FROM ' + tableModel + ' P ' + sql_obj + ' WHERE P.rule=' + connection.escape(rule) + ' AND P.position=' + connection.escape(position) + ' ORDER BY P.position_order';
        logger.debug(sql);
        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else
                callback(null, rows);
        });
    });

};

//Get  policy_r__ipobj by primarykey
policy_r__ipobjModel.getPolicy_r__ipobj = function (rule, ipobj, ipobj_g, interface, position, callback) {

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');

        var sql = 'SELECT * FROM ' + tableModel +
                ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position) +
                ' ORDER BY position_order';

        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else
                callback(null, rows);
        });
    });
};


//Add new policy_r__ipobj 
policy_r__ipobjModel.insertPolicy_r__ipobj = function (policy_r__ipobjData, set_negate, callback) {

    OrderList(policy_r__ipobjData.position_order, policy_r__ipobjData.rule, policy_r__ipobjData.position, 999999);

    //Check if IPOBJ TYPE is ALLOWED in this Position
    checkIpobjPosition(policy_r__ipobjData.rule, policy_r__ipobjData.ipobj, policy_r__ipobjData.ipobj_g, policy_r__ipobjData.interface, policy_r__ipobjData.position, function (error, data) {
        if (error) {
            callback(error, {"error": error});
        } else {
            allowed = data;
            if (allowed) {
                //Check if the IPOBJ in this position are negated
                getNegateRulePosition(policy_r__ipobjData.rule, policy_r__ipobjData.position, function (error, data) {
                    if (error) {
                        callback(error, {"error": "error"});
                    } else {
                        negate = data;
                        if (set_negate)
                            negate = 1;

                        db.get(function (error, connection) {
                            if (error)
                                return done('Database problem');
                            connection.query('INSERT INTO ' + tableModel + ' SET negate=' + negate + ', ?', policy_r__ipobjData, function (error, result) {
                                if (error) {
                                    callback(error, {"error": error});
                                } else {
                                    //devolvemos la última id insertada
                                    callback(null, {"msg": "success"});
                                }
                            });
                        });
                    }
                });
            } else {
                callback({"allowed": 0, "error": "NOT ALLOWED"}, null);
            }
        }
    });

};

//Update policy_r__ipobj
policy_r__ipobjModel.updatePolicy_r__ipobj = function (rule, ipobj, ipobj_g, interface, position, position_order, policy_r__ipobjData, callback) {

    if (position !== policy_r__ipobjData.position) {
        //ordenamos posicion antigua
        OrderList(999999, rule, position, position_order);
        //ordenamos posicion nueva
        OrderList(policy_r__ipobjData.position_order, policy_r__ipobjData.rule, policy_r__ipobjData.position, 999999);
    } else
        OrderList(policy_r__ipobjData.position_order, rule, position, position_order);

    //Check if IPOBJ TYPE is ALLOWED in this Position
    //checkIpobjPosition(rule, ipobj, ipobj_g, interface, position, callback) {
    checkIpobjPosition(policy_r__ipobjData.rule, policy_r__ipobjData.ipobj, policy_r__ipobjData.interface, policy_r__ipobjData.position, function (error, data) {
        if (error) {
            callback(error, {"error": "error"});
        } else {
            allowed = data;
            if (allowed) {
                //Check if the IPOBJ in this position are negated
                getNegateRulePosition(policy_r__ipobjData.rule, policy_r__ipobjData.position, function (error, data) {
                    if (error) {
                        logger.debug("ERROR : ", error);
                    } else {
                        negate = data;
                        logger.debug("RULE: " + policy_r__ipobjData.rule, +"  Position: " + policy_r__ipobjData.position + "  NEGATE: " + negate);
                        db.get(function (error, connection) {
                            if (error)
                                return done('Database problem');
                            var sql = 'UPDATE ' + tableModel + ' SET ' +
                                    'rule = ' + connection.escape(policy_r__ipobjData.rule) + ',' +
                                    'ipobj = ' + connection.escape(policy_r__ipobjData.ipobj) + ',' +
                                    'ipobj_g = ' + connection.escape(policy_r__ipobjData.ipobj_g) + ',' +
                                    'interface = ' + connection.escape(policy_r__ipobjData.interface) + ',' +
                                    'position = ' + connection.escape(policy_r__ipobjData.position) + ',' +
                                    'position_order = ' + connection.escape(policy_r__ipobjData.position_order) + ', ' +
                                    'negate = ' + connection.escape(negate) + ' ' +
                                    ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                                    ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position) +
                                    ' AND interface=' + connection.escape(interface);

                            connection.query(sql, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                } else {
                                    callback(null, {"msg": "success"});
                                }
                            });
                        });
                    }
                });
            } else {
                callback({"allowed": 0, "error": "NOT ALLOWED"}, null);
            }
        }
    });
};

//Update policy_r__ipobj Position ORDER
policy_r__ipobjModel.updatePolicy_r__ipobj_position_order = function (rule, ipobj, ipobj_g, interface, position, position_order, new_order, callback) {

    OrderList(new_order, rule, position, position_order);

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sql = 'UPDATE ' + tableModel + ' SET ' +
                'position_order = ' + connection.escape(new_order) + ' ' +
                ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position) +
                ' AND interface=' + connection.escape(interface);

        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, {"msg": "success"});
            }
        });
    });
};

//Update policy_r__ipobj POSITION
//When Update position we order New and Old POSITION
policy_r__ipobjModel.updatePolicy_r__ipobj_position = function (rule, ipobj, ipobj_g, interface, position, position_order, new_rule, new_position, new_order, callback) {

    //Check if IPOBJ TYPE is ALLOWED in this Position    
    checkIpobjPosition(new_rule, ipobj, ipobj_g, interface, new_position, function (error, data) {
        if (error) {
            callback(error, {"error": "error"});
        } else {
            allowed = data;
            if (allowed) {
                getNegateRulePosition(new_rule, new_position, function (error, data) {
                    if (error) {
                        logger.debug("ERROR : ", error);
                    } else {
                        negate = data;
                        db.get(function (error, connection) {
                            if (error)
                                return done('Database problem');
                            //Order New position
                            OrderList(new_order, new_rule, new_position, 999999);
                            
                            var sql = 'UPDATE ' + tableModel + ' SET ' +
                                    'rule = ' + connection.escape(new_rule) + ', ' +
                                    'position = ' + connection.escape(new_position) + ', ' +
                                    'position_order = ' + connection.escape(new_order) + ', ' +
                                    'negate = ' + connection.escape(negate) + ' ' +
                                    ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                                    ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position) +
                                    ' AND interface=' + connection.escape(interface);
                            logger.debug(sql);
                            connection.query(sql, function (error, result) {
                                if (error) {
                                    callback(error, null);
                                } else {
                                    //Order Old position
                                    OrderList(999999, rule, position, position_order);                                    
                                    
                                    callback(null, {"msg": "success"});
                                }
                            });
                        });
                    }
                });

            } else {
                callback({"allowed": 0, "error": "NOT ALLOWED"}, null);
            }
        }
    });
};
//Update policy_r__ipobj NEGATE
//UPDATE ALL IPOBJ in this Position to new NEGATE status
policy_r__ipobjModel.updatePolicy_r__ipobj_negate = function (rule, position, negate, callback) {


    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sql = 'UPDATE ' + tableModel + ' SET ' +
                'negate = ' + connection.escape(negate) + ' ' +
                ' WHERE rule = ' + connection.escape(rule) + ' ' +
                ' AND position=' + connection.escape(position);
        connection.query(sql, function (error, result) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, {"msg": "success"});
            }
        });
    });
};
function OrderList(new_order, rule, position, old_order) {
    var increment = '+1';
    var order1 = new_order;
    var order2 = old_order;
    if (new_order > old_order) {
        increment = '-1';
        order1 = old_order;
        order2 = new_order;
    }
    logger.debug("---> ORDENANDO RULE IPOBJ: " + rule + " POSITION: " + position + "  OLD_ORDER: " + old_order + "  NEW_ORDER: " + new_order);

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sql = 'UPDATE ' + tableModel + ' SET ' +
                'position_order = position_order' + increment +
                ' WHERE rule = ' + connection.escape(rule) + ' AND position=' + connection.escape(position) +
                ' AND position_order>=' + order1 + ' AND position_order<=' + order2;
        logger.debug(sql);
        connection.query(sql);
    });
}


function checkIpobjPosition(rule, ipobj, ipobj_g, interface, position, callback) {

    var allowed = 0;
    db.get(function (error, connection) {
        if (error)
            callback(null, 0);
        var sql = "";
        if (ipobj > 0) {
            sql = 'select A.allowed from ipobj O ' +
                    'inner join ipobj_type T on O.type=T.id ' +
                    'inner join ipobj_type__policy_position A on A.type=O.type ' +
                    ' WHERE O.id = ' + connection.escape(ipobj) + ' AND A.position=' + connection.escape(position);
        } else if (ipobj_g > 0) {
            sql = 'select A.allowed from ipobj_g O ' +
                    'inner join ipobj_type T on O.type=T.id ' +
                    'inner join ipobj_type__policy_position A on A.type=O.type ' +
                    ' WHERE O.id = ' + connection.escape(ipobj_g) + ' AND A.position=' + connection.escape(position);
        } else if (interface > 0) {
            sql = 'select A.allowed from interface O ' +
                    'inner join ipobj_type T on O.interface_type=T.id ' +
                    'inner join ipobj_type__policy_position A on A.type=O.interface_type ' +
                    ' WHERE O.id = ' + connection.escape(interface) + ' AND A.position=' + connection.escape(position);
        }
        logger.debug(sql);
        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else {
                allowed = rows[0].allowed;
                if (allowed > 0)
                    callback(null, 1);
                else
                    callback(null, 0);
            }
        });
    });
}

function getNegateRulePosition(rule, position, callback) {

    var Nneg = 0;
    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sql = 'SELECT count(negate) as neg FROM ' + tableModel +
                ' WHERE rule = ' + connection.escape(rule) + ' AND position=' + connection.escape(position) +
                ' AND negate=1';
        //logger.debug('SQL: ' + sql);
        connection.query(sql, function (error, rows) {
            if (error)
                callback(error, null);
            else {
                Nneg = rows[0].neg;
                //logger.debug('Nneg 1: ' + Nneg);
                if (Nneg > 0)
                    callback(null, 1);
                else
                    callback(null, 0);
            }
        });
    });
}

//Remove policy_r__ipobj 
policy_r__ipobjModel.deletePolicy_r__ipobj = function (rule, ipobj, ipobj_g, interface, position, position_order, callback) {

    OrderList(999999, rule, position, position_order);
    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sqlExists = 'SELECT * FROM ' + tableModel +
                ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position);
        connection.query(sqlExists, function (error, row) {
            //If exists Id from policy_r__ipobj to remove
            if (row) {
                db.get(function (error, connection) {
                    var sql = 'DELETE FROM ' + tableModel +
                            ' WHERE rule = ' + connection.escape(rule) + ' AND ipobj=' + connection.escape(ipobj) +
                            ' AND ipobj_g=' + connection.escape(ipobj_g) + ' AND position=' + connection.escape(position) +
                            ' AND interface=' + connection.escape(interface);
                    connection.query(sql, function (error, result) {
                        if (error) {
                            callback(error, null);
                        } else {
                            callback(null, {"msg": "deleted"});
                        }
                    });
                });
            } else {
                callback(null, {"msg": "notExist"});
            }
        });
    });
};


//Order policy_r__ipobj Position
policy_r__ipobjModel.orderPolicyPosition = function (rule, position, callback) {

    logger.debug("DENTRO ORDER   Rule: " + rule + '  Position: ' + position);

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sqlPos = 'SELECT * FROM ' + tableModel + ' WHERE rule = ' + connection.escape(rule) + ' AND position= ' + connection.escape(position) + ' order by position_order';
        logger.debug(sqlPos);
        connection.query(sqlPos, function (error, rows) {
            if (rows.length > 0) {
                var order = 0;
                async.map(rows, function (row, callback1) {
                    order++;
                    db.get(function (error, connection) {
                        sql = 'UPDATE ' + tableModel + ' SET position_order=' + order +
                                ' WHERE rule = ' + connection.escape(row.rule) + ' AND ipobj=' + connection.escape(row.ipobj) +
                                ' AND ipobj_g=' + connection.escape(row.ipobj_g) + ' AND position=' + connection.escape(row.position) +
                                ' AND interface=' + connection.escape(row.interface);
                        //logger.debug(sql);
                        connection.query(sql, function (error, result) {
                            if (error) {
                                callback1();
                            } else {
                                callback1();
                            }
                        });
                    });
                }, //Fin de bucle
                        function (err) {
                            callback(null, {"msg": "success"});
                        }

                );

            } else {
                callback(null, {"msg": "notExist"});
            }
        });
    });
};

//Order policy_r__ipobj Position
policy_r__ipobjModel.orderPolicy = function (rule, callback) {

    logger.debug("DENTRO ORDER : " + rule);

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sqlRule = 'SELECT * FROM ' + tableModel + ' WHERE rule = ' + connection.escape(rule) + ' order by position, position_order';
        logger.debug(sqlRule);
        connection.query(sqlRule, function (error, rows) {
            if (rows.length > 0) {
                var order = 0;
                var prev_position = 0;
                async.map(rows, function (row, callback1) {
                    var position = row.position;
                    if (position !== prev_position) {
                        order = 1;
                        prev_position = position;
                    } else
                        order++;

                    db.get(function (error, connection) {
                        sql = 'UPDATE ' + tableModel + ' SET position_order=' + order +
                                ' WHERE rule = ' + connection.escape(row.rule) + ' AND ipobj=' + connection.escape(row.ipobj) +
                                ' AND ipobj_g=' + connection.escape(row.ipobj_g) + ' AND position=' + connection.escape(row.position) +
                                ' AND interface=' + connection.escape(row.interface);
                        //logger.debug(sql);
                        connection.query(sql, function (error, result) {
                            if (error) {
                                callback1();
                            } else {
                                callback1();
                            }
                        });
                    });
                }, //Fin de bucle
                        function (err) {
                            callback(null, {"msg": "success"});
                        }

                );

            } else {
                callback(null, {"msg": "notExist"});
            }
        });
    });
};

//Order policy_r__ipobj Position
policy_r__ipobjModel.orderAllPolicy = function (callback) {

    logger.debug("DENTRO ORDER ALL: ");

    db.get(function (error, connection) {
        if (error)
            return done('Database problem');
        var sqlRule = 'SELECT * FROM ' + tableModel + ' ORDER by rule,position, position_order';
        logger.debug(sqlRule);
        connection.query(sqlRule, function (error, rows) {
            if (rows.length > 0) {
                var order = 0;
                var prev_rule = 0;
                var prev_position = 0;
                async.map(rows, function (row, callback1) {
                    var position = row.position;
                    var rule = row.rule;
                    if (position !== prev_position || rule !== prev_rule) {
                        order = 1;
                        prev_rule = rule;
                        prev_position = position;
                    } else
                        order++;

                    db.get(function (error, connection) {
                        sql = 'UPDATE ' + tableModel + ' SET position_order=' + order +
                                ' WHERE rule = ' + connection.escape(row.rule) + ' AND ipobj=' + connection.escape(row.ipobj) +
                                ' AND ipobj_g=' + connection.escape(row.ipobj_g) + ' AND position=' + connection.escape(row.position) +
                                ' AND interface=' + connection.escape(row.interface);
                        //logger.debug(sql);
                        connection.query(sql, function (error, result) {
                            if (error) {
                                callback1();
                            } else {
                                callback1();
                            }
                        });
                    });
                }, //Fin de bucle
                        function (err) {
                            logger.debug("FIN De BUCLE");
                            callback(null, {"msg": "success"});
                        }

                );

            } else {
                callback(null, {"msg": "notExist"});
            }
        });
    });
};

//Export the object
module.exports = policy_r__ipobjModel;