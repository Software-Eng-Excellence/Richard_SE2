interface Handler{
    handler(): void;
    setNext(handler:Handler): void;
}

class Logger implements Handler{
    private  next :  Handler;
    constructor(private message: string) {
        this.message = message;
    }
    handle(input: any): string {
        throw new Error("Method not implemented.");
    }
    setNextHandler(handler: Handler): void {
        throw new Error("Method not implemented.");
    }
    handler(): void {
        console.log(this.message);
        if(this.next) {
            this.next.handler();
        }
    }
    setNext(handler: Handler): void {

        this.next = handler;
    }
} 

const log1 = new Logger("This is log 1");
const log2 = new Logger("This is log 2");
const log3 = new Logger("This is log 3");

log1.setNext(log2);
log2.setNext(log3);

log1.handler();
