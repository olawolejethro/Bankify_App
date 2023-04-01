"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const user1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const user2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const user3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const user4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [user1, user2, user3, user4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

let currentUser;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();

  currentUser = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    //display UI
    labelWelcome.textContent = `Welcome ${currentUser.owner}`;
    containerApp.style.opacity = 100;

    // clear input field
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    //upadteUI
    updateUI(currentUser);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = "";
  if (
    amount > 0 &&
    recieverAcc &&
    currentUser.balance >= amount &&
    recieverAcc?.username !== currentUser.username
  ) {
    //doing the transfer
    currentUser.movements.push(-amount);
    recieverAcc.movements.push(amount);
    //UPDATE UI
    updateUI(currentUser);
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  const userPIn = Number(inputClosePin.value);
  const comfirmUsername = inputCloseUsername.value;
  const currentUserIndex = accounts.findIndex(
    (acc) => acc.username === currentUser.username
  );
  if (userPIn === currentUser.pin && comfirmUsername === currentUser.username) {
    // delete account
    accounts.splice(currentUserIndex, 1);

    // Hide UI
    containerApp.style.opacity = 0;
    inputClosePin.value = inputLoginPin.value = "";
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = inputLoanAmount.value;
  if (amount > 0 && currentUser.movements.some((mov) => mov >= amount * 0.1)) {
    //Add movement
    currentUser.movements.push(amount);
    //update UI
    updateUI(currentUser);
  }
  console.log("LOAN", amount);
});

const updateUI = function (acc) {
  displayMovement(acc.movements);
  //displayBalance
  calDisplayBalance(acc);
  //displaySummary
  displaySummary(acc);
};
const displayMovement = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrwal";

    const formatedHtml = `    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}$</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", `${formatedHtml}`);
  });
};

// displayMovement(user1.movements);

const displaySummary = function (acc) {
  const input = acc.movements
    .filter((mov) => mov > 0)
    .reduce((prev, curr, i, arr) => prev + curr, 0);

  const outPut = acc.movements
    .filter((mov) => mov < 0)
    .reduce((prev, curr, i, arr) => prev + curr, 0);

  const intrest = acc.movements
    .filter((mov) => mov > 0)
    .map((depo) => (depo * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((prev, curr) => prev + curr, 0);

  labelSumIn.textContent = `${Math.abs(input)}$`;
  labelSumOut.textContent = `${Math.abs(outPut)}$`;
  labelSumInterest.textContent = `${Math.abs(intrest)}$`;
};
// displaySummary(currentUser);
const calDisplayBalance = function (accs) {
  accs.balance = accs.movements.reduce((prev, curr, i, arr) => prev + curr, 0);
  labelBalance.textContent = `${accs.balance}$`;
};
// calDisplayBalance(user2.movements);
const createUsername = function (Accs) {
  Accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);
