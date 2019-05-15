define({ "api": [
  {
    "type": "PUT",
    "url": "/customer/restricted",
    "title": "Restrictions for customer deletion",
    "name": "DelCustomer",
    "group": "CUSTOMER",
    "description": "<p>Check that there are no restrictions for customer deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customer's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 10\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n   \"result\": true,\n   \"restrictions\": {\n       \"CustomerHasUsers\": true\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/customer.js",
    "groupTitle": "CUSTOMER"
  },
  {
    "type": "PUT",
    "url": "/customer/del",
    "title": "Delete customer",
    "name": "DelCustomer",
    "group": "CUSTOMER",
    "description": "<p>Delete customer from the database. <br>A middleware is used for verify that the customer has no users before allow the deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customer's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n  \"msg\": \"Not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n   \"result\": true,\n   \"restrictions\": {\n       \"CustomerHasUsers\": true\n   }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/customer.js",
    "groupTitle": "CUSTOMER"
  },
  {
    "type": "PUT",
    "url": "/customer/get",
    "title": "Get customer data",
    "name": "GetCustomer",
    "group": "CUSTOMER",
    "description": "<p>Get customer data.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "customer",
            "description": "<p>Id of the customer. <br>If empty, the API will return an array with the id and name for all the customers. <br>If it is not empty, it will return a json object with all the data for the indicated customer id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n\t\"customer\": 2\n}",
          "type": "json"
        },
        {
          "title": "Request-Example:",
          "content": "{\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"id\": 2,\n   \"name\": \"FWCloud.net\",\n   \"addr\": \"C/Carrasca, 7 - 03590 Altea (Alicante) - Spain\",\n   \"phone\": \"+34 966 446 046\",\n   \"email\": \"info@fwcloud.net\",\n   \"web\": \"https://fwcloud.net\",\n   \"created_at\": \"2019-05-13T10:40:36.000Z\",\n   \"updated_at\": \"2019-05-13T10:40:36.000Z\",\n   \"created_by\": 0,\n   \"updated_by\": 0\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"id\": 1,\n       \"name\": \"SOLTECSIS, S.L.\"\n   },\n   {\n       \"id\": 2,\n       \"name\": \"FWCloud.net\"\n   }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n  \"msg\": \"Not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/customer.js",
    "groupTitle": "CUSTOMER"
  },
  {
    "type": "POST",
    "url": "/customer",
    "title": "New customer",
    "name": "NewCustomer",
    "group": "CUSTOMER",
    "description": "<p>Create new customer. Customers allow group users.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "customer",
            "description": "<p>New customer's id. <br>The API will check that don't exists another customer with this id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Customer's name. <br>The API will check that don't exists another customer with the same name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "addr",
            "description": "<p>Customer's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Customer's telephone.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Customer's e-mail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "web",
            "description": "<p>Customer's website.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 1,\n  \"name\": \"FWCloud.net\",\n  \"addr\": \"C/Carrasca, 7 - 03590 Altea (Alicante) - Spain\",\n  \"phone\": \"+34 966 446 046\",\n  \"email\": \"info@fwcloud.net\",\n  \"web\": \"https://fwcloud.net\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1004,\n  \"msg\": \"Already exists with the same id\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1005,\n  \"msg\": \"Already exists with the same name\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/customer.js",
    "groupTitle": "CUSTOMER"
  },
  {
    "type": "PUT",
    "url": "/customer",
    "title": "Update customer",
    "name": "UpdateCustomer",
    "group": "CUSTOMER",
    "description": "<p>Update customer's information.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "customer",
            "description": "<p>Id of the customer that you want modify.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Customer's name. <br>The API will check that don't exists another customer with the same name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "addr",
            "description": "<p>Customer's address.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "phone",
            "description": "<p>Customer's telephone.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>Customer's e-mail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "web",
            "description": "<p>Customer's website.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 2,\n  \"name\": \"FWCloud.net\",\n  \"addr\": \"C/Carrasca, 7 - 03590 Altea (Alicante) - Spain\",\n  \"phone\": \"+34 966 446 046\",\n  \"email\": \"info@fwcloud.net\",\n  \"web\": \"https://www.fwcloud.net\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n  \"msg\": \"Not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1005,\n  \"msg\": \"Already exists with the same name\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/customer.js",
    "groupTitle": "CUSTOMER"
  },
  {
    "type": "PUT",
    "url": "/firewall/clone",
    "title": "Clone firewall",
    "name": "CloneFirewall",
    "group": "FIREWALL",
    "description": "<p>Create a new firewall cloning the one indicated in the request's parameters.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud to which the cloned firewall will belong.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "firewall",
            "description": "<p>Id of the firewall to be cloned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Cloned firewall's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Cloned firewall's comment.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "node_id",
            "description": "<p>ID of the tree node to wich the cloned firewall will be added.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n\t\t\"firewall\": 5,\n   \"name\": \"Firewall-CLONED\",\n\t\t\"comment\": \"Comment for the cloned firewall.\",\n   \"node_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"insertId\": 7\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7001,\n   \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "PUT",
    "url": "/firewall/del",
    "title": "Delete firewall",
    "name": "DelFirewall",
    "group": "FIREWALL",
    "description": "<p>Delete a firewall.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id of the firewall to delete.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "firewall",
            "description": "<p>Id of the firewall to be deleted.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n\t\t\"firewall\": 7\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7001,\n   \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "PUT",
    "url": "/firewall/get",
    "title": "Get firewall data",
    "name": "GetFirewall",
    "group": "FIREWALL",
    "description": "<p>Get firewall data.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "firewall",
            "description": "<p>Firewall's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n  \t\"firewall\": 5\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"id\": 5,\n  \"cluster\": null,\n  \"fwcloud\": 1,\n  \"name\": \"Firewall-05\",\n  \"comment\": null,\n  \"created_at\": \"2019-05-15T10:34:46.000Z\",\n  \"updated_at\": \"2019-05-15T10:34:47.000Z\",\n  \"compiled_at\": null,\n  \"installed_at\": null,\n  \"by_user\": 1,\n  \"status\": 3,\n  \"install_user\": \"\",\n  \"install_pass\": \"\",\n  \"save_user_pass\": 0,\n  \"install_interface\": null,\n  \"install_ipobj\": null,\n  \"fwmaster\": 0,\n  \"install_port\": 22,\n  \"options\": 0,\n  \"interface_name\": null,\n  \"ip_name\": null,\n  \"ip\": null,\n  \"id_fwmaster\": null\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 7001,\n \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "PUT",
    "url": "/firewall/cloud/get",
    "title": "Get firewalls in cloud",
    "name": "GetFirewallsCloud",
    "group": "FIREWALL",
    "description": "<p>Get firewalls data by fwcloud.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"cluster\": null,\n    \"fwcloud\": 1,\n    \"name\": \"Firewall-01\",\n    \"comment\": null,\n    \"created_at\": \"2019-05-15T10:34:46.000Z\",\n    \"updated_at\": \"2019-05-15T10:34:47.000Z\",\n    \"compiled_at\": null,\n    \"installed_at\": null,\n    \"by_user\": 1,\n    \"status\": 3,\n    \"install_user\": \"\",\n    \"install_pass\": \"\",\n    \"save_user_pass\": 0,\n    \"install_interface\": null,\n    \"install_ipobj\": null,\n    \"fwmaster\": 0,\n    \"install_port\": 22,\n    \"options\": 0,\n    \"interface_name\": null,\n    \"ip_name\": null,\n    \"ip\": null,\n    \"id_fwmaster\": null\n  },\n  {\n    \"id\": 2,\n    \"cluster\": null,\n    \"fwcloud\": 1,\n    \"name\": \"Firewall-02\",\n    \"comment\": null,\n    \"created_at\": \"2019-05-15T10:34:46.000Z\",\n    \"updated_at\": \"2019-05-15T10:34:47.000Z\",\n    \"compiled_at\": null,\n    \"installed_at\": null,\n    \"by_user\": 1,\n    \"status\": 3,\n    \"install_user\": \"\",\n    \"install_pass\": \"\",\n    \"save_user_pass\": 0,\n    \"install_interface\": null,\n    \"install_ipobj\": null,\n    \"fwmaster\": 0,\n    \"install_port\": 22,\n    \"options\": 0,\n    \"interface_name\": null,\n    \"ip_name\": null,\n    \"ip\": null,\n    \"id_fwmaster\": null\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 7001,\n \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "PUT",
    "url": "/firewall/cluster/get",
    "title": "Get firewalls in cluster",
    "name": "GetFirewallsCluster",
    "group": "FIREWALL",
    "description": "<p>Get firewalls data by cluster.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "cluster",
            "description": "<p>Cluster id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n\t\t\"cluster\": 2\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n  {\n    \"id\": 1,\n    \"cluster\": 2,\n    \"fwcloud\": 1,\n    \"name\": \"Firewall-01\",\n    \"comment\": null,\n    \"created_at\": \"2019-05-15T10:34:46.000Z\",\n    \"updated_at\": \"2019-05-15T10:34:47.000Z\",\n    \"compiled_at\": null,\n    \"installed_at\": null,\n    \"by_user\": 1,\n    \"status\": 3,\n    \"install_user\": \"\",\n    \"install_pass\": \"\",\n    \"save_user_pass\": 0,\n    \"install_interface\": null,\n    \"install_ipobj\": null,\n    \"fwmaster\": 1,\n    \"install_port\": 22,\n    \"options\": 0,\n    \"interface_name\": null,\n    \"ip_name\": null,\n    \"ip\": null,\n    \"id_fwmaster\": null\n  },\n  {\n    \"id\": 2,\n    \"cluster\": 2,\n    \"fwcloud\": 1,\n    \"name\": \"Firewall-02\",\n    \"comment\": null,\n    \"created_at\": \"2019-05-15T10:34:46.000Z\",\n    \"updated_at\": \"2019-05-15T10:34:47.000Z\",\n    \"compiled_at\": null,\n    \"installed_at\": null,\n    \"by_user\": 1,\n    \"status\": 3,\n    \"install_user\": \"\",\n    \"install_pass\": \"\",\n    \"save_user_pass\": 0,\n    \"install_interface\": null,\n    \"install_ipobj\": null,\n    \"fwmaster\": 0,\n    \"install_port\": 22,\n    \"options\": 0,\n    \"interface_name\": null,\n    \"ip_name\": null,\n    \"ip\": null,\n    \"id_fwmaster\": null\n  }\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 7001,\n \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "POST",
    "url": "/firewall",
    "title": "New firewall",
    "name": "NewFirewall",
    "group": "FIREWALL",
    "description": "<p>Create a new firewall.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud to which the new firewall will belong.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "cluster",
            "description": "<p>If this firewall is part of a firewalls cluster, the cluter's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "fwmaster",
            "description": "<p>If this firewall is part of a firewalls cluster, this parameters indicates if it is the cluster master.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Firewall's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Firewall's comment.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "install_user",
            "description": "<p>SSH user used for firewall access.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "install_pass",
            "description": "<p>SSH password used for firewall access.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "save_user_pass",
            "description": "<p>Save the SSH user/password in the database.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_interface",
            "description": "<p>Id of the firewall's network interface used for policy upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_ipobj",
            "description": "<p>Id of the firewall's address used for policy upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_port",
            "description": "<p>TCP port used for the SSH communication.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "options",
            "description": "<p>Firewall's flag options.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "node_id",
            "description": "<p>ID of the tree node to wich the new firewall will be added.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n   \"name\": \"Firewall-01\",\n   \"save_user_pass\": 0,\n   \"install_port\": 22,\n   \"fwmaster\": 0,\n   \"options\": 0,\n   \"node_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"insertId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n\t \"msg\":\t\"Not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7002,\n  \"msg\": \"Tree node access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "PUT",
    "url": "/firewall",
    "title": "Update firewall",
    "name": "UpdateFirewall",
    "group": "FIREWALL",
    "description": "<p>Update firewall information.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud to which the firewall belongs.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "firewall",
            "description": "<p>Firewall's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "cluster",
            "description": "<p>If this firewall is part of a firewalls cluster, the cluter's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "fwmaster",
            "description": "<p>If this firewall is part of a firewalls cluster, this parameters indicates if it is the cluster master.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Firewall's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>Firewall's comment.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "install_user",
            "description": "<p>SSH user used for firewall access.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "install_pass",
            "description": "<p>SSH password used for firewall access.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "save_user_pass",
            "description": "<p>Save the SSH user/password in the database.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_interface",
            "description": "<p>Id of the firewall's network interface used for policy upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_ipobj",
            "description": "<p>Id of the firewall's address used for policy upload.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "install_port",
            "description": "<p>TCP port used for the SSH communication.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "options",
            "description": "<p>Firewall's flag options.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "node_id",
            "description": "<p>ID of the tree node to wich the new firewall will be added.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"fwcloud\": 1,\n\t\t\"firewall\": 5,\n   \"name\": \"Firewall-UPDATED\",\n\t\t\"comment\": \"Comment for the updated firewall.\",\n   \"save_user_pass\": 0,\n   \"install_port\": 22,\n   \"fwmaster\": 0,\n   \"options\": 3\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7001,\n   \"msg\": \"Firewall access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/firewall/firewall.js",
    "groupTitle": "FIREWALL"
  },
  {
    "type": "GET",
    "url": "/fwcloud/get",
    "title": "Get allowed fwclouds",
    "name": "GetAllowedFwclouds",
    "group": "FWCLOUD",
    "description": "<p>Get fwcloud data for all the fwclouds to which the logged used has access.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[\n   {\n       \"id\": 4,\n       \"name\": \"FWCloud-02\",\n       \"created_at\": \"2019-05-14T11:37:19.000Z\",\n       \"updated_at\": \"2019-05-14T11:37:19.000Z\",\n       \"created_by\": 0,\n       \"updated_by\": 0,\n       \"locked_at\": null,\n       \"locked_by\": null,\n       \"locked\": 0,\n       \"image\": \"\",\n       \"comment\": \"\"\n   },\n   {\n       \"id\": 5,\n       \"name\": \"FWCloud-03\",\n       \"created_at\": \"2019-05-14T11:37:24.000Z\",\n       \"updated_at\": \"2019-05-14T11:57:06.000Z\",\n       \"created_by\": 0,\n       \"updated_by\": 0,\n       \"locked_at\": \"2019-05-14T11:57:06.000Z\",\n       \"locked_by\": 1,\n       \"locked\": 1,\n       \"image\": \"\",\n       \"comment\": \"\"\n\t\t}\n\t}\n]",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/fwcloud/fwcloud.js",
    "groupTitle": "FWCLOUD"
  },
  {
    "type": "PUT",
    "url": "/fwcloud/get",
    "title": "Get fwcloud data",
    "name": "GetFwcloud",
    "group": "FWCLOUD",
    "description": "<p>Get fwcloud data.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"id\": 3\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"id\": 3,\n   \"name\": \"FWCloud-Updated\",\n   \"created_at\": \"2019-05-14T11:37:15.000Z\",\n   \"updated_at\": \"2019-05-14T11:37:54.000Z\",\n   \"created_by\": 0,\n   \"updated_by\": 0,\n   \"locked_at\": \"2019-05-14T11:37:51.000Z\",\n   \"locked_by\": 1,\n   \"locked\": 1,\n   \"image\": \"\",\n   \"comment\": \"Comment for the updated fwcloud.\"\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7000,\n   \"msg\": \"FWCloud access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/fwcloud/fwcloud.js",
    "groupTitle": "FWCLOUD"
  },
  {
    "type": "POST",
    "url": "/fwcloud",
    "title": "New fwcloud",
    "name": "NewFwcloud",
    "group": "FWCLOUD",
    "description": "<p>Create a new FWCloud.<br> One FWCloud is an agrupation of logical IP objects.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>FWCloud's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Image vinculated to this FWCloud..</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>FWCloud's comment.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"name\": \"FWCloud-01\",\n  \"image\": \"\",\n  \"comment\": \"My first FWCloud.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"insertId\": 1\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/fwcloud/fwcloud.js",
    "groupTitle": "FWCLOUD"
  },
  {
    "type": "PUT",
    "url": "/fwcloud",
    "title": "Update fwcloud",
    "name": "UpdateFwcloud",
    "group": "FWCLOUD",
    "description": "<p>Update FWCloud information.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>Id of the FWCloud that we want modify.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>FWCloud's name.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "image",
            "description": "<p>Image vinculated to this FWCloud..</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "comment",
            "description": "<p>FWCloud's comment.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"id\": 1,\n  \"name\": \"FWCloud-Updated\",\n  \"image\": \"\",\n  \"comment\": \"Comment for the updated fwcloud.\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n   \"fwcErr\": 7000,\n   \"msg\": \"FWCloud access not allowed\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/fwcloud/fwcloud.js",
    "groupTitle": "FWCLOUD"
  },
  {
    "type": "PUT",
    "url": "/user/del",
    "title": "Delete user",
    "name": "DelCustomer",
    "group": "USER",
    "description": "<p>Delete user from the database. <br>A middleware is used for verify that this is not the last user with the admin role in the database.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Id of the customer the user belongs to.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>Id of the user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 2\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 OK",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n\t \"msg\":\t\"Not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "PUT",
    "url": "/user/get",
    "title": "Get user data",
    "name": "GetUser",
    "group": "USER",
    "description": "<p>Get user data.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Id of the customer the user belongs to.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "user",
            "description": "<p>Id of the user. <br>If empty, the API will return the id and name for all the users of this customer.. <br>If it is not empty, it will return all the data for the indicated user.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 2,\n  \"user\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n   \"id\": 2,\n   \"customer\": 2,\n   \"name\": \"My Personal Name\",\n   \"email\": \"info@fwcloud.net\",\n   \"username\": \"fwcusr\",\n   \"password\": \"mysecret\",\n   \"enabled\": 1,\n   \"role\": 1,\n   \"allowed_from\": \"10.99.4.10,192.168.1.1\",\n   \"last_login\": null,\n   \"confirmation_token\": null,\n   \"created_at\": \"2019-05-13T15:11:20.000Z\",\n   \"updated_at\": \"2019-05-13T15:11:20.000Z\",\n   \"created_by\": 0,\n   \"updated_by\": 0\n}",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n\t \"msg\":\t\"Not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "POST",
    "url": "/login",
    "title": "Log into the API",
    "name": "LoginUser",
    "group": "USER",
    "description": "<p>Validate the user credentials and initialize data in the session file.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customert's id to which this user belongs to.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username for login into the FWCloud.net web interface.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Username's password.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 1,\n  \"username\": \"fwcadmin\",\n  \"password\": \"fwcadmin\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 401 Unauthorized\n{\n  \"fwcErr\": 1001,\n  \"msg\": \"Bad username or password\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "POST",
    "url": "/logout",
    "title": "Log out the API",
    "name": "LogoutUser",
    "group": "USER",
    "description": "<p>Close a previous created user session.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 OK",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "POST",
    "url": "/user",
    "title": "New user",
    "name": "NewUser",
    "group": "USER",
    "description": "<p>Create new user.<br></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customert id to which this user belongs to. <br>The API will check that exists a customer with this id. If the customer don't exists a not found error will be generated.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Full name of the owner of this user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>User's e-mail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username for login into the FWCloud.net web interface.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Username's password.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enabled",
            "description": "<p>If the user access is enabled or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role",
            "description": "<p>The role assigned to this user. <br>1 = Admin. Full access. <br>2 = Manager. Cand manage the assigned clouds. Clouds are assigned by an user with admin role.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "allowed_from",
            "description": "<p>Comma separated list of IPs from which the user will be allowed to access to the FWCloud.net web interface.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 2,\n  \"name\": \"My Personal Name\",\n  \"email\": \"info@fwcloud.net\",\n  \"username\": \"fwcusr\",\n  \"password\": \"mysecret\",\n  \"enabled\": 1,\n  \"role\": 1,\n  \"allowed_from\": \"10.99.4.10,192.168.1.1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n\t \"msg\":\t\"Not found\"\n}",
          "type": "json"
        },
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1003,\n\t \"msg\":\t\"Already exists\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "PUT",
    "url": "/user/restricted",
    "title": "Restrictions for user deletion",
    "name": "RestrictedUser",
    "group": "USER",
    "description": "<p>Check that there are no restrictions for user deletion.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customer's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>User's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 10,\n  \"user\": 5\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"response\": {\n        \"respStatus\": true,\n        \"respCode\": \"ACR_OK\",\n        \"respCodeMsg\": \"Ok\",\n        \"respMsg\": \"\",\n        \"errorCode\": \"\",\n        \"errorMsg\": \"\"\n    },\n    \"data\": {}\n}",
          "type": "json"
        },
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 403 Forbidden\n{\n  \"result\": true,\n  \"restrictions\": {\n    \"CustomerHasUsers\": true\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "PUT",
    "url": "/user",
    "title": "Update user",
    "name": "UpdateUser",
    "group": "USER",
    "description": "<p>Update user's data.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>User's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "customer",
            "description": "<p>Customert id to which this user belongs to. <br>The API will check that exists a customer with this id.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Full name of the owner of this user.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>User's e-mail.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "username",
            "description": "<p>Username for login into the FWCloud.net web interface.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>Username's password.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "enabled",
            "description": "<p>If the user access is enabled or not.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "role",
            "description": "<p>The role assigned to this user. <br>1 = Admin. Full access. <br>2 = Manager. Cand manage the assigned clouds. Clouds are assigned by an user with admin role.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "allowed_from",
            "description": "<p>Comma separated list of IPs from which the user will be allowed to access to the FWCloud.net web interface.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"customer\": 2,\n  \"name\": \"My Personal Name\",\n  \"email\": \"info@fwcloud.net\",\n  \"username\": \"fwcloud\",\n  \"password\": \"mysecret\",\n  \"enabled\": 1,\n  \"role\": 1,\n  \"allowed_from\": \"10.99.4.10,192.168.1.1\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "error": {
      "examples": [
        {
          "title": "Error-Response:",
          "content": "HTTP/1.1 400 Bad Request\n{\n  \"fwcErr\": 1002,\n\t \"msg\":\t\"Not found\"\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "POST",
    "url": "/user/fwcloud",
    "title": "Enable cloud access.",
    "name": "UserAccessFwcloud",
    "group": "USER",
    "description": "<p>Allow a user the access to a fwcloud.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>User's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"user\": 5,\n  \"fwcloud\": 2\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  },
  {
    "type": "PUT",
    "url": "/user/fwcloud/del",
    "title": "Disable cloud access.",
    "name": "UserDisableFwcloud",
    "group": "USER",
    "description": "<p>Disable user access to a fwcloud.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "user",
            "description": "<p>User's id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "fwcloud",
            "description": "<p>FWCloud's id.</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n  \"user\": 5,\n  \"fwcloud\": 2\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 204 No Content",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "routes/user/user.js",
    "groupTitle": "USER"
  }
] });
