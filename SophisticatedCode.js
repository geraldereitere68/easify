/*
File Name: SophisticatedCode.js
Description: This code demonstrates a complex implementation of a banking system.
*/

class Account {
  constructor(accountNumber, accountHolder, balance) {
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = balance;
  }

  deposit(amount) {
    this.balance += amount;
  }

  withdraw(amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
    } else {
      throw new Error("Insufficient funds");
    }
  }
}

class SavingsAccount extends Account {
  constructor(accountNumber, accountHolder, balance, interestRate) {
    super(accountNumber, accountHolder, balance);
    this.interestRate = interestRate;
  }

  calculateInterest() {
    const interest = this.balance * (this.interestRate / 100);
    this.deposit(interest);
  }
}

class CheckingAccount extends Account {
  constructor(accountNumber, accountHolder, balance, overdraftLimit) {
    super(accountNumber, accountHolder, balance);
    this.overdraftLimit = overdraftLimit;
  }

  withdraw(amount) {
    if (this.balance + this.overdraftLimit >= amount) {
      this.balance -= amount;
    } else {
      throw new Error("Insufficient funds");
    }
  }
}

class Bank {
  constructor() {
    this.accounts = [];
  }

  createAccount(account) {
    this.accounts.push(account);
  }

  findAccountByAccountNumber(accountNumber) {
    return this.accounts.find(acc => acc.accountNumber === accountNumber);
  }

  closeAccount(accountNumber) {
    const accountIndex = this.accounts.findIndex(acc => acc.accountNumber === accountNumber);
    if (accountIndex !== -1) {
      this.accounts.splice(accountIndex, 1);
    } else {
      throw new Error("Account not found");
    }
  }
}

// Usage Example:

const bank = new Bank();

const savingsAccount = new SavingsAccount(12345678, "John Doe", 5000, 2.5);
const checkingAccount = new CheckingAccount(98765432, "Jane Smith", 1000, 500);

bank.createAccount(savingsAccount);
bank.createAccount(checkingAccount);

console.log(bank.findAccountByAccountNumber(12345678)); // Output: SavingsAccount {accountNumber: 12345678, ...}
console.log(bank.findAccountByAccountNumber(98765432)); // Output: CheckingAccount {accountNumber: 98765432, ...}

savingsAccount.calculateInterest();
checkingAccount.withdraw(200);

console.log(savingsAccount.balance); // Output: 5025
console.log(checkingAccount.balance); // Output: 800

bank.closeAccount(12345678);
console.log(bank.accounts); // Output: [CheckingAccount {accountNumber: 98765432, ...}]