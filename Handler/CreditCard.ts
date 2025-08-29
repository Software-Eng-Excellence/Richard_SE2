interface Handler {
  handle(input: any): string;
  setNextHandler(handler: Handler): void;
}


class BaseHandler {
  protected next: Handler;

  handle(request) {
    if (this.next) {
      return this.next.handle(request);
    }
    return "Request not handled";
  }
  setNextHandler(next: Handler) {
    this.next = next;
  }
}

class PaymentHandler extends BaseHandler {
  handle(amount: number): string {
    if (this.next) {
      return this.next.handle(amount);
    }
    return "Payment failed.";
  }
}

class WalletHandler extends PaymentHandler {
  private balance: number;

  constructor(balance: number, next?: Handler) {
    super();
    this.balance = balance;
    if (next) {
      this.setNextHandler(next);
    }
  }

  handle(amount: number): string {
    if (this.balance >= amount) {
      this.balance = this.balance - amount;
      return `Paid ${amount} using Wallet.`;
    }
    return super.handle(amount);
  }
}

class CreditCardHandler extends     PaymentHandler{
  handle(amount: number): string {
    return `Paid ${amount} using Credit Card.`;
  }
}

// Setup Chain
// const creditCard = new CreditCardHandler();
// const wallet = new WalletHandler(50, creditCard); // the wallet can handle paying a total of 50

// console.log(wallet.handle(30)); // "Paid 30 using Wallet."
// console.log(wallet.handle(60)); // "Paid 60 using Credit Card."