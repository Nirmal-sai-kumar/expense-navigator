function loadSection(section) {
    const contentDiv = document.getElementById("content");
    let contentHTML = "";

    if (section === "add-income") {
        contentHTML = `
            <h3>Add Income</h3>
            <form action="income.php" method="POST">
                <label for="income-date">Date:</label>
                <input type="date" id="income-date" name="income_date" required>
                
                <label for="job-title">Job Title:</label>
                <input type="text" id="job-title" name="job_title" required>
                
                <label for="income-amount">Amount:</label>
                <input type="number" id="income-amount" name="income_amount" required>
                
                <button type="submit" name="add_income">Add Income</button>
            </form>
        `;
    } else if (section === "add-expense") {
        contentHTML = `
            <h3>Add Expense</h3>
            <form action="expense.php" method="POST">
                <label for="expense-date">Date:</label>
                <input type="date" id="expense-date" name="expense_date" required>
                
                <label for="source">Source:</label>
                <input type="text" id="source" name="source" required>
                
                <label for="expense-amount">Amount:</label>
                <input type="number" id="expense-amount" name="expense_amount" required>
                
                <button type="submit" name="add_expense">Add Expense</button>
            </form>
        `;
    } else if (section === "view-income") {
        contentHTML = `<h3>View Income</h3><iframe src="view_income.php" width="100%" height="300px"></iframe>`;
    } else if (section === "view-expense") {
        contentHTML = `<h3>View Expense</h3><iframe src="view_expense.php" width="100%" height="300px"></iframe>`;
    }

    contentDiv.innerHTML = contentHTML;
}
