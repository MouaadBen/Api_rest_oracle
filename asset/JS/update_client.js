let id;

document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  id = urlParams.get("CustomerTransactionId");

  if (!id) {
    alert("ID du client manquant dans l'URL");
    return;
  }

  try {
    const res = await fetch(
        `../api/update_client.php?CustomerTransactionId=${id}`
      );
    const data = await res.json();

    const client = data.items?.[0];
    if (!client) throw new Error("Client non trouvé.");

    document.getElementById("PayingCustomerName").value =
      client.PayingCustomerName || "";
    document.getElementById("PayingCustomerSite").value =
      client.PayingCustomerSite || "";
    document.getElementById("BillToCustomerName").value =
      client.BillToCustomerName || "";
    document.getElementById("TransactionNumber").value =
      client.TransactionNumber || "";
    document.getElementById("RemitToAddress").value =
      client.RemitToAddress || "";
    document.getElementById("TransactionDate").value =
      client.TransactionDate?.split("T")[0] || "";
    document.getElementById("TransactionType").value =
      client.TransactionType || "";
  } catch (err) {
    console.error(err);
    alert("Erreur de chargement des données client.");
  }
});

document
  .getElementById("updateInvoiceForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedClient = {
      PayingCustomerName: document.getElementById("PayingCustomerName").value,
      PayingCustomerSite: document.getElementById("PayingCustomerSite").value,
      BillToCustomerName: document.getElementById("BillToCustomerName").value,
      TransactionNumber: document.getElementById("TransactionNumber").value,
      RemitToAddress: document.getElementById("RemitToAddress").value,
      TransactionDate: document.getElementById("TransactionDate").value,
      TransactionType: document.getElementById("TransactionType").value,
    };

    try {
      const res = await fetch(
        `../api/save_client.php?CustomerTransactionId=${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedClient),
        }
      );

      const result = await res.json();
      if (res.ok) {
        alert("Client mis à jour avec succès !");
        window.location.href = "clients.html";
      } else {
        alert("Erreur : " + (result.error || "Échec de la mise à jour"));
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau lors de la mise à jour.");
    }
  });
