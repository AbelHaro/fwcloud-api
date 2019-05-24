//create object
var customerModel = {};
var tableModel="customer";

//Add new customer
customerModel.insert = req => {
	return new Promise(async (resolve, reject) => {
		//New object with customer data
		var customerData = {
			id: req.body.customer,
			addr: req.body.addr,
			phone: req.body.phone,
			name: req.body.name,
			email: req.body.email,
			web: req.body.web
		};

		req.dbCon.query(`INSERT INTO ${tableModel} SET ?`, customerData, (error, result) => {			
			if (error) return reject(error);
			resolve(result.insertId);
		});
	});
};


customerModel.existsId = (dbCon, customer) => {
	return new Promise(async (resolve, reject) => {
		dbCon.query(`select id from ${tableModel} where id=${customer}`, (error, result) => {
			if (error) return reject(error);
			if (result.length>0) return resolve(true);
			resolve(false);
		});
	});
};


customerModel.existsName = (dbCon, name) => {
	return new Promise(async (resolve, reject) => {
		dbCon.query(`select id from ${tableModel} where name=${dbCon.escape(name)}`, (error, result) => {
			if (error) return reject(error);
			if (result.length>0) return resolve(result[0].id);
			resolve(false);
		});
	});
};


//Update customer
customerModel.update = req => {
	return new Promise(async (resolve, reject) => {
		let sql = `UPDATE ${tableModel} SET name=${req.dbCon.escape(req.body.name)},
			email=${req.dbCon.escape(req.body.email)},
			addr=${req.dbCon.escape(req.body.addr)},
			phone=${req.dbCon.escape(req.body.phone)},
			web=${req.dbCon.escape(req.body.web)}
			WHERE id=${req.body.customer}`;
		req.dbCon.query(sql, (error, result) => {
			if (error) return reject(error);
			resolve();
		});
	});
};


//Update customer
customerModel.get = req => {
	return new Promise(async (resolve, reject) => {
		let sql = (req.body.customer) ? `select * from ${tableModel} WHERE id=${req.body.customer}` : `select id,name from ${tableModel}`;
		req.dbCon.query(sql, (error, result) => {
			if (error) return reject(error);
			resolve(result);
		});
	});
};


customerModel.delete = req => {
	return new Promise(async (resolve, reject) => {
		req.dbCon.query(`delete from ${tableModel} where id=${req.body.customer}`, (error, result) => {
			if (error) return reject(error);
			resolve();
		});
	});
};


customerModel.searchUsers = req => {
	return new Promise((resolve, reject) => {
    req.dbCon.query(`select count(*) as n from user where customer =${req.body.customer}`, async (error, result) => {
      if (error) return reject(error);

      if (result[0].n > 0)
        resolve({result: true, restrictions: { CustomerHasUsers: true}});
      else
        resolve({result: false});
    });
  });
};

customerModel.lastCustomer = req => {
	return new Promise((resolve, reject) => {
    req.dbCon.query(`select count(*) as n from ${tableModel} where id!=${req.body.customer}`, async (error, result) => {
      if (error) return reject(error);

      if (result[0].n === 0)
        resolve({result: true, restrictions: { LastCustomer: true}});
      else
        resolve({result: false});
    });
  });
};

//Export the object
module.exports = customerModel;