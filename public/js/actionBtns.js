const removeClient = (btn) => {
  const clientId = btn.closest("tr").querySelector("[name=clientId]").value;
  const onTheFly = true;
  const csrf = document.querySelector("[name=_csrf]").value;
  const clientRow = btn.closest("tr");
  const data = new URLSearchParams();
  data.append("clientId", clientId);
  data.append("onTheFly", onTheFly);
  fetch("/admin/remove/subscriper", {
    method: "POST",
    body: data,
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      if (data.message === "removed") {
        clientRow.remove();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const deleteBTNS = document.querySelectorAll(".dltBtn");
if (deleteBTNS) {
  for (let i = 0; i < deleteBTNS.length; ++i) {
    deleteBTNS[i].addEventListener("click", (e) => {
      removeClient(e.target.parentNode);
    });
  }
}

const editClient = (btn) => {
  const clientId = btn.closest("tr").querySelector("[name=clientId]").value;
  const onTheFly = true;
  fetch("/find/subscriper/" + clientId + "/" + onTheFly, {
    method: "GET",
  }).then((result) => {
    window.location.replace(result.url);
  });
};

const editBTNS = document.querySelectorAll(".edtBtn");
if (editBTNS) {
  for (let i = 0; i < editBTNS.length; ++i) {
    editBTNS[i].addEventListener("click", (e) => {
      editClient(e.target.parentNode);
    });
  }
}
