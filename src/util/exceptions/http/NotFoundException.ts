import { HttpException } from "./HttpException";


//status code 404 its bydefault i add to the super class ...
export class NotFoundException extends HttpException {
    constructor(message: string="Resource Not Found", details?: Record<string, unknown>) {
        super(404, message, details);
        this.name = 'NotFoundException';
    }
}