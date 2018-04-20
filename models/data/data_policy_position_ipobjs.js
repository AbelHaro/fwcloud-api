
//Create New objet with data policy_r
function policy_position_ipobjs_data(data, order, negate, type) {
    this.id = data.id;
    this.name = data.name;
    this.position_order = order;
    this.negate = negate;
    this.fwcloud = data.fwcloud;
    this.comment = data.comment;

    if (type === 'O') {
        this.type = data.type;
        this.interface = data.interface;
        this.protocol = data.protocol;
        this.address = data.address;
        this.netmask = data.netmask;
        this.diff_serv = data.diff_serv;
        this.ip_version = data.ip_version;
        this.code = data.code;
        this.tcp_flags_mask = data.tcp_flags_mask;
        this.tcp_flags_settings = data.tcp_flags_settings;
        this.range_start = data.range_start;
        this.range_end = data.range_end;
        this.source_port_start = data.source_port_start;
        this.source_port_end = data.source_port_end;
        this.destination_port_start = data.destination_port_start;
        this.destination_port_end = data.destination_port_end;
        this.options = data.options;
        this.icmp_type = data.icmp_type;
        this.icmp_code = data.icmp_code;

    } else if (type === 'I') {
        this.type = data.interface_type;
        this.labelName = data.labelName;
        if (data.interface_type == 10) {  //interface Firewall
            if (data.cluster_id !== null) {
                this.parent_id = data.cluster_id;
                this.parent_name = data.cluster_name;
                this.parent_type = 100;
            } else {
                this.parent_id = data.firewall_id;
                this.parent_name = data.firewall_name;
                this.parent_type = 0;
            }
        } else {   //interface Host
            this.parent_id = data.host_id;
            this.parent_name = data.host_name;
            this.parent_type = 8;
        }


    } else if (type === 'G') {
        this.type = data.type;
    }

    try {
        this.fwcloud_tree = data.fwcloud_tree;
    } catch (err) {
        this.fwcloud_tree = data.fwcloud;
    }


}
;



//Export the object
module.exports = policy_position_ipobjs_data;


