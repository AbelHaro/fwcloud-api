import { Controller } from "../../fonaments/http/controller";
import { Firewall } from "../../models/firewall/Firewall";
import { getRepository } from "typeorm";
import { Request } from "express";
import { ResponseBuilder } from "../../fonaments/http/response-builder";
import { FirewallService } from "../../models/firewall/firewall.service";
import { Progress } from "../../fonaments/http/progress/progress";
import { FirewallPolicy } from "../../policies/firewall.policy";

export class FirewallController extends Controller {
    
    protected firewallService: FirewallService;

    public async make(): Promise<void> {
        this.firewallService = await this._app.getService<FirewallService>(FirewallService.name);
    }
    
    public async compile(request: Request): Promise<ResponseBuilder> {
        const firewall: Firewall = await getRepository(Firewall).findOneOrFail({
            id: parseInt(request.params.firewall),
            fwCloudId: parseInt(request.params.fwcloud)
        });

        (await FirewallPolicy.compile(firewall, request.session.user)).authorize()

        const progress: Progress<Firewall> = this.firewallService.compile(firewall);

        return ResponseBuilder.buildResponse().status(201).progress(progress);
    }
}