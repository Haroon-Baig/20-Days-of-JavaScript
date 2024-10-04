// Get elements from the DOM
const budgetInput = document.getElementById('budget');
const itemInput = document.getElementById('item');
const costInput = document.getElementById('cost');
const setBudgetBtn = document.getElementById('setBudgetBtn');
const addExpenseBtn = document.getElementById('addExpenseBtn');
const expenseList = document.getElementById('expenseList');
const displayBudget = document.getElementById('displayBudget');
const totalExpenses = document.getElementById('totalExpenses');
const remainingBudget = document.getElementById('remainingBudget');
const resetBtn = document.getElementById('resetBtn'); // Reset button

// Variables to hold values
let budget = 0;
let expenses = 0;
let expenseData = [];

// Event listener to set the budget
setBudgetBtn.addEventListener('click', function() {
    budget = Number(budgetInput.value);
    displayBudget.textContent = budget.toFixed(2);
    updateRemainingBudget();
    saveToLocalStorage();  // Save to local storage after setting budget
});

// Event listener to add an expense
addExpenseBtn.addEventListener('click', function() {
    const itemName = itemInput.value;
    const itemCost = Number(costInput.value);
    
    if (itemName === "" || itemCost <= 0) {
        alert("Please enter valid item and cost!");
        return;
    }

    // Add expense to the list
    const listItem = document.createElement('li');
    listItem.textContent = `${itemName}: $${itemCost.toFixed(2)}`;
    expenseList.appendChild(listItem);
    
    // Update total expenses and remaining budget
    expenses += itemCost;
    totalExpenses.textContent = expenses.toFixed(2);
    updateRemainingBudget();

    // Add expense data for chart and update the chart
    expenseData.push({ name: itemName, cost: itemCost });
    updateChart();

    // Clear the inputs
    itemInput.value = '';
    costInput.value = '';

    saveToLocalStorage();  // Save to local storage after adding an expense
});

// Event listener for the reset button
resetBtn.addEventListener('click', function() {
    // Clear all data
    budget = 0;
    expenses = 0;
    expenseData = [];
    displayBudget.textContent = '0.00';
    totalExpenses.textContent = '0.00';
    remainingBudget.textContent = '0.00';
    expenseList.innerHTML = '';  // Clear the expense list

    // Reset the chart
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    chart.update();

    // Clear local storage
    localStorage.removeItem('expenseTracker');
});

// Function to update the remaining budget
function updateRemainingBudget() {
    const remaining = budget - expenses;
    remainingBudget.textContent = remaining.toFixed(2);

    // Change color if over budget
    if (remaining < 0) {
        remainingBudget.style.color = 'red';
    } else {
        remainingBudget.style.color = 'green';
    }
}

// Save data to local storage
function saveToLocalStorage() {
    const expenseDataObj = {
        budget: budget,
        expenses: expenses,
        expenseList: expenseList.innerHTML,
        expenseData: expenseData
    };
    localStorage.setItem('expenseTracker', JSON.stringify(expenseDataObj));
}

// Load data from local storage
function loadFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('expenseTracker'));
    if (savedData) {
        budget = savedData.budget;
        expenses = savedData.expenses;
        expenseList.innerHTML = savedData.expenseList;
        expenseData = savedData.expenseData;
        displayBudget.textContent = budget.toFixed(2);
        totalExpenses.textContent = expenses.toFixed(2);
        updateRemainingBudget();
        updateChart();  // Update chart with loaded data
    }
}

// Call the function to load data on page load
window.onload = loadFromLocalStorage;

// Create a Chart.js Pie Chart
const ctx = document.getElementById('expenseChart').getContext('2d');
let chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: [], // Labels for the chart (e.g., item names)
        datasets: [{
            label: 'Expense Distribution',
            data: [], // Data for the chart (e.g., item costs)
            backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
                'rgba(255, 159, 64, 0.6)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Expense Breakdown'
            }
        }
    }
});

// Function to update the chart when new expense is added
function updateChart() {
    const labels = expenseData.map(expense => expense.name);
    const data = expenseData.map(expense => expense.cost);

    // Update chart data
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
}
