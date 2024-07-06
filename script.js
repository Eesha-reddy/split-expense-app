let expenses = [];
let totalAmount = 0;

const enterName = document.getElementById('enter-name');
const categorySelect = document.getElementById('category-select');
const amountInput = document.getElementById('amount-input');
const dateInput = document.getElementById('date-input');
const addBtn = document.getElementById('add-btn');
const expensesTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');
const totalByPersonTableBody = document.getElementById('total-by-person-table-body');

// Function to save expenses to local storage
function saveExpenses() {
    console.log('Saving expenses to local storage...');
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to load expenses from local storage
function loadExpenses() {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        expenses = JSON.parse(storedExpenses);
        console.log('Loaded expenses from local storage:', expenses);
        renderExpenses();
    }
}

// Function to render expenses in the table
function renderExpenses() {
    // Clear existing table rows
    expensesTableBody.innerHTML = '';

    // Render each expense in the table
    expenses.forEach(expense => {
        const newRow = expensesTableBody.insertRow();
        const nameCell = newRow.insertCell();
        const categoryCell = newRow.insertCell();
        const amountCell = newRow.insertCell();
        const dateCell = newRow.insertCell();
        const deleteCell = newRow.insertCell();
        const deleteBtn = document.createElement('button');

        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', function() {
            const index = expenses.indexOf(expense);
            if (index > -1) {
                expenses.splice(index, 1);
                saveExpenses();
                renderExpenses();
                renderTotalByPerson();
            }
        });

        nameCell.textContent = expense.name;
        categoryCell.textContent = expense.category;
        amountCell.textContent = expense.amount;
        dateCell.textContent = expense.date;
        deleteCell.appendChild(deleteBtn);
    });

    // Update total amount
    updateTotalAmount();
    renderTotalByPerson();
}

// Function to update total amount
function updateTotalAmount() {
    totalAmount = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    totalAmountCell.textContent = totalAmount;
}

// Function to render total expenses by person
function renderTotalByPerson() {
    const totalsByPerson = expenses.reduce((totals, expense) => {
        if (!totals[expense.name]) {
            totals[expense.name] = 0;
        }
        totals[expense.name] += parseFloat(expense.amount);
        return totals;
    }, {});

    // Clear existing table rows
    totalByPersonTableBody.innerHTML = '';

    // Render totals by person in the table
    for (const [name, total] of Object.entries(totalsByPerson)) {
        const newRow = totalByPersonTableBody.insertRow();
        const nameCell = newRow.insertCell();
        const totalCell = newRow.insertCell();

        nameCell.textContent = name;
        totalCell.textContent = total;
    }
}

// Event listener for add button
addBtn.addEventListener('click', function() {
    const name = enterName.value;
    const category = categorySelect.value;
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;

    console.log('Adding new expense:', { name, category, amount, date });

    if (name === '') {
        alert('Please enter a name');
        return;
    }

    if (category === '') {
        alert('Please select a category');
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    if (date === '') {
        alert('Please select a date');
        return;
    }

    const expense = { name, category, amount, date };
    expenses.push(expense);

    // Save expenses to local storage
    saveExpenses();

    // Render expenses in the table
    renderExpenses();

    // Clear input fields after adding expense
    enterName.value = '';
    amountInput.value = '';
    dateInput.value = '';
});

// Load expenses from local storage on page load
loadExpenses();
