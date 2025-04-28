let allInvoices = [];
const rowsPerPage = 5;
let currentPage = 1;

document.addEventListener("DOMContentLoaded", () => {
  const pathname = window.location.pathname;

  if (pathname.endsWith("clients.html")) {
    setupSearch();
    loadInvoices();
  }
});

function setupSearch() {
  const searchInput = document.getElementById("searchInput");

  if (!searchInput) {
    console.error("🔴 Élément searchInput introuvable !");
    return;
  }

  searchInput.addEventListener("keyup", () => {
    const filter = searchInput.value.toLowerCase();
    renderTable(filter);
    renderPagination();
  });
}

async function loadInvoices(page = 1) {
  try {
    const res = await fetch(`../api/get_factures.php?action=list&page=${page}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allInvoices = Array.isArray(data.items) ? data.items : [];
    renderTable();
    renderPagination();
  } catch (err) {
    console.error("Erreur chargement clients :", err);
  }
}

function renderTable(filter = "") {
  const tbody = document.querySelector("#invoicesTable tbody");
  tbody.innerHTML = "";

  const filteredInvoices = allInvoices.filter((inv) => {
    const rowText = `${inv.PayingCustomerName} ${inv.PayingCustomerSite} ${inv.BillToCustomerName} ${inv.TransactionNumber} ${inv.RemitToAddress} ${inv.TransactionDate} ${inv.TransactionType}`.toLowerCase();
    return rowText.includes(filter);
  });

  const start = (currentPage - 1) * rowsPerPage;
  const paginatedItems = filteredInvoices.slice(start, start + rowsPerPage);

  paginatedItems.forEach((inv) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${inv.PayingCustomerName}</td>
      <td>${inv.PayingCustomerSite}</td>
      <td>${inv.BillToCustomerName}</td>
      <td>${inv.TransactionNumber}</td>
      <td>${inv.RemitToAddress}</td>
      <td>${inv.TransactionDate}</td>
      <td>${inv.TransactionType}</td>
      <td>
        <a href="update_client.html?CustomerTransactionId=${inv.CustomerTransactionId}">
          <button class="btn btn-primary btn-sm">Modifier</button>
        </a>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const searchInput = document.getElementById("searchInput");
  const filter = searchInput ? searchInput.value.toLowerCase() : "";

  const filteredCount = allInvoices.filter((inv) => {
    const rowText = `${inv.PayingCustomerName} ${inv.PayingCustomerSite} ${inv.BillToCustomerName} ${inv.TransactionNumber} ${inv.RemitToAddress} ${inv.TransactionDate} ${inv.TransactionType}`.toLowerCase();
    return rowText.includes(filter);
  }).length;

  const pageCount = Math.ceil(filteredCount / rowsPerPage);

  const createButton = (label, page) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.className = `btn btn-sm mx-1 ${page === currentPage ? "btn-primary" : "btn-outline-primary"}`;
    btn.disabled = (page === 0 || page < 1 || page > pageCount);
    btn.onclick = () => {
      currentPage = page;
      renderTable(filter);
      renderPagination();
    };
    return btn;
  };

  pagination.appendChild(createButton("«", 1));
  pagination.appendChild(createButton("<", currentPage - 1));

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) {
      pagination.appendChild(createButton(i, i));
    }
  } else {
    if (currentPage <= 4) {
      for (let i = 1; i <= 5; i++) {
        pagination.appendChild(createButton(i, i));
      }
      pagination.appendChild(createButton("...", 0));
      pagination.appendChild(createButton(pageCount, pageCount));
    } else if (currentPage > pageCount - 4) {
      pagination.appendChild(createButton(1, 1));
      pagination.appendChild(createButton("...", 0));
      for (let i = pageCount - 4; i <= pageCount; i++) {
        pagination.appendChild(createButton(i, i));
      }
    } else {
      pagination.appendChild(createButton(1, 1));
      pagination.appendChild(createButton("...", 0));
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pagination.appendChild(createButton(i, i));
      }
      pagination.appendChild(createButton("...", 0));
      pagination.appendChild(createButton(pageCount, pageCount));
    }
  }

  pagination.appendChild(createButton(">", currentPage + 1));
  pagination.appendChild(createButton("»", pageCount));
}

let sortDirection = "asc";

function sortInvoicesByDate() {
  allInvoices.sort((a, b) => {
    const dateA = new Date(a.TransactionDate);
    const dateB = new Date(b.TransactionDate);

    if (sortDirection === "asc") {
      return dateA - dateB;
    } else {
      return dateB - dateA;
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const sortDateBtn = document.getElementById("sortDateBtn");

  if (sortDateBtn) {
    sortDateBtn.addEventListener("click", function () {
      sortDirection = sortDirection === "asc" ? "desc" : "asc"; 
      sortInvoicesByDate(); 
      renderTable(document.getElementById("searchInput").value.toLowerCase()); 
      renderPagination();
    });
  }
});