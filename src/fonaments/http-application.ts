import express from "express";
import { AbstractApplication } from "./abstract-application";
import Query from "../database/Query";
import { RequestInputs } from "./http/request-inputs";
import io from 'socket.io';
import { SocketMiddleware } from "./http/sockets/socket-middleware";
import { SessionSocketMiddleware } from "../middleware/Session";
import { WebSocketService } from "../sockets/web-socket.service";
import { Middleware } from "./http/middleware/Middleware";
import { RouterService } from "./http/router/router.service";
import { Routes } from "../routes/routes";

declare module 'express-serve-static-core' {
    interface Request {
        dbCon: Query,
        inputs: RequestInputs
    }
}

export abstract class HTTPApplication extends AbstractApplication {
    protected _express: express.Application;
    protected _socketio: io.Server;

    protected constructor(path: string = process.cwd()) {
        try {
            super(path);
            this._express = express();
        } catch (e) {
            console.error('Aplication HTTP startup failed: ' + e.message);
            process.exit(e);
        }
    }

    get express(): express.Application {
        return this._express;
    }

    get socketio(): io.Server {
        return this._socketio;
    }

    public async bootstrap(): Promise<AbstractApplication> {
        await super.bootstrap();

        this.registerMiddlewares('before');
        
        const routerService: RouterService = await this.getService<RouterService>(RouterService.name);
        routerService.registerRoutes(Routes);
        
        this.registerMiddlewares('after');
    
        return this;
    }

    public async setSocketIO(socketIO: io.Server): Promise<io.Server> {
        this._socketio = socketIO;

        const sessionMiddleware: SocketMiddleware = new SessionSocketMiddleware();
        sessionMiddleware.register(this);

        const wsService: WebSocketService = await this.getService<WebSocketService>(WebSocketService.name);
        wsService.setSocketIO(this._socketio);

        return this._socketio;
    }

    /**
     * Register all middlewares
     */
    protected registerMiddlewares(group: 'before' | 'after'): void {
        let middlewares: Array<any> = [];

        if (group === 'before') {
            middlewares = this.beforeMiddlewares();
            for (let i = 0; i < middlewares.length; i++) {
                const middleware: Middleware = new middlewares[i]();
                middleware.register(this);
            }
        }

        if (group === 'after') {
            middlewares = this.afterMiddlewares();
            for (let i = 0; i < middlewares.length; i++) {
                const middleware: Middleware = new middlewares[i]();
                middleware.register(this);
            }
        }
    }

    /**
     * Returns an array of Middleware classes to be registered before the routes handlers
     */
    protected abstract beforeMiddlewares(): Array<any>;

    /**
     * Returns an array of Middleware classes to be registered after the routes handlers
     */
    protected abstract afterMiddlewares(): Array<any>;
}