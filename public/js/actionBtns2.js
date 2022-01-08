const deleteClient = (btn) => {
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

const removeBTNS = document.querySelectorAll(".dltBtn");
if (removeBTNS) {
  for (let i = 0; i < removeBTNS.length; ++i) {
    removeBTNS[i].addEventListener("click", (e) => {
      deleteClient(e.target.parentNode);
    });
  }
}

const modifyClient = (btn) => {
  const clientId = btn.closest("tr").querySelector("[name=clientId]").value;
  const onTheFly = true;
  fetch("/find/subscriper/" + clientId + "/" + onTheFly, {
    method: "GET",
  }).then((result) => {
    window.location.replace(result.url);
  });
};

const modifyBTNS = document.querySelectorAll(".edtBtn");
if (modifyBTNS) {
  for (let i = 0; i < modifyBTNS.length; ++i) {
    modifyBTNS[i].addEventListener("click", (e) => {
      modifyClient(e.target.parentNode);
    });
  }
}
