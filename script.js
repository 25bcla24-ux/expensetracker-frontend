const API = "http://localhost:5000/api/expenses";

async function addExpense() {
  const title = document.getElementById("title").value.trim();
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value.trim();

  if (!title || !amount || !category) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, amount, category })
    });

    const data = await res.json();
    console.log(data);

    document.getElementById("title").value = "";
    document.getElementById("amount").value = "";
    document.getElementById("category").value = "";

    loadExpenses();

  } catch (err) {
    console.error(err);
    alert("Error adding expense");
  }
}

async function loadExpenses() {
  try {
    const res = await fetch(API);
    const data = await res.json();

    const list = document.getElementById("list");
    const totalElement = document.getElementById("total");

    list.innerHTML = "";
    let total = 0;

    data.forEach(exp => {
      total += Number(exp.amount);

      const li = document.createElement("li");
      li.innerHTML = `
        <div>
          <strong>${exp.title}</strong><br>
          ₹${exp.amount} (${exp.category})
        </div>
        <button class="delete-btn" onclick="deleteExpense('${exp._id}')">X</button>
      `;

      list.appendChild(li);
    });

    totalElement.innerText = total;

  } catch (err) {
    console.error(err);
  }
}

async function deleteExpense(id) {
  if (!confirm("Delete this expense?")) return;

  await fetch(`${API}/${id}`, {
    method: "DELETE"
  });

  loadExpenses();
}

// ✅ Load on start
window.onload = loadExpenses;