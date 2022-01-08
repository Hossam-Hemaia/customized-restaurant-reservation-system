const sellerEarnings = () => {
  const dateFrom = document.querySelector("[name=dateFrom]").value;
  const dateTo = document.querySelector("[name=dateTo]").value;
  const csrf = document.querySelector("[name=_csrf]").value;
  const data = new URLSearchParams();
  data.append("dateFrom", dateFrom);
  data.append("dateTo", dateTo);
  fetch("/allSubscripers/report", {
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
      let oldScript = document.getElementById("oldScr");
      oldScript.remove();
      const table = document.getElementById("subscripersTbl");
      for (let sub of data.subscripers) {
        let tr = document.createElement("tr");
        let tdSerial = document.createElement("td");
        tdSerial.innerText = sub.clientSerial;
        let tdName = document.createElement("td");
        tdName.innerText = sub.clientName;
        let tdPhone = document.createElement("td");
        tdPhone.innerText = sub.clientNumber;
        let tdPeriod = document.createElement("td");
        tdPeriod.innerText = sub.subscriptionPeriod;
        let tdStartDate = document.createElement("td");
        tdStartDate.innerText = sub.startDate;
        let tdEndDate = document.createElement("td");
        tdEndDate.innerText = sub.endDate;
        let tdRemainingPeriod = document.createElement("td");
        remainingDays = Math.floor(sub.remainingPeriod);
        tdRemainingPeriod.innerText = remainingDays;
        if (remainingDays > 5 && remainingDays <= 11) {
          tdRemainingPeriod.style.backgroundColor = "yellow";
        } else if (remainingDays <= 5) {
          tdRemainingPeriod.style.backgroundColor = "red";
        }
        let tdNumberOfMeals = document.createElement("td");
        tdNumberOfMeals.innerText = sub.numberOfMeals;
        let tdNumberOfSnacks = document.createElement("td");
        tdNumberOfSnacks.innerText = sub.numberOfSnacks;
        let tdNotices = document.createElement("td");
        tdNotices.innerText = sub.notices;
        let tdPrice = document.createElement("td");
        tdPrice.innerText = sub.subscriptionPrice;
        let clientIdInput = document.createElement("input");
        clientIdInput.name = "clientId";
        clientIdInput.type = "hidden";
        clientIdInput.value = sub.clientId;
        let editBtn = document.createElement("button");
        let img = document.createElement("img");
        img.src = "/img/icon/edit.svg";
        img.classList.add("action_icon");
        editBtn.classList.add("edtBtn");
        editBtn.classList.add("action-btn");
        editBtn.append(img);
        let removeBtn = document.createElement("button");
        let img2 = document.createElement("img");
        img2.src = "/img/icon/remove.svg";
        img2.classList.add("action_icon");
        removeBtn.classList.add("dltBtn");
        removeBtn.classList.add("action-btn");
        removeBtn.append(img2);
        let tdActions = document.createElement("td");
        tdActions.style.width = "200px";
        tdActions.append(editBtn, removeBtn);
        tr.append(
          tdSerial,
          tdName,
          tdPhone,
          tdPeriod,
          tdStartDate,
          tdEndDate,
          tdRemainingPeriod,
          tdNumberOfMeals,
          tdNumberOfSnacks,
          tdNotices,
          tdPrice,
          tdActions,
          clientIdInput
        );
        const trs = document.querySelectorAll(".subTr");
        if (trs) {
          for (let i = 0; i < trs.length; ++i) {
            trs[i].remove();
          }
        }
        tr.classList.add("subTr");
        table.append(tr);
      }
      let script = document.createElement("script");
      script.src = "/js/actionBtns2.js";
      document.body.append(script);
    })
    .catch((err) => {
      console.log(err);
    });
};

const sellerEarningsBtn = document.getElementById("slrErnRprt");
if (sellerEarningsBtn) {
  sellerEarningsBtn.addEventListener("click", () => {
    sellerEarnings();
  });
}

function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;

  // CSV FILE
  csvFile = new Blob([csv], { type: "text/csv" });

  // Download link
  downloadLink = document.createElement("a");

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = "none";

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  // Lanzamos
  downloadLink.click();
}

function export_table_to_csv(html, filename) {
  var csv = [];
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [],
      cols = rows[i].querySelectorAll("td, th");

    for (var j = 0; j < cols.length; j++) row.push(cols[j].innerText);

    csv.push(row.join(","));
  }

  // Download CSV
  download_csv(csv.join("\n"), filename);
}

const reportDownBtn = document.querySelector(".rprtDownload");
if (reportDownBtn) {
  reportDownBtn.addEventListener("click", function () {
    const html = document.querySelector("table").outerHTML;
    export_table_to_csv(html, "report.csv");
  });
}

const remainingDaysTrs = document.querySelectorAll(".rmDays");
if (remainingDaysTrs) {
  for (let i = 0; i < remainingDaysTrs.length; ++i) {
    let remainingDays = +remainingDaysTrs[i].innerText;
    if (remainingDays > 5 && remainingDays <= 11) {
      remainingDaysTrs[i].style.backgroundColor = "yellow";
    } else if (remainingDays <= 5) {
      remainingDaysTrs[i].style.backgroundColor = "red";
    }
  }
}
//automatically calculate the number of subscription days
const startDateInput = document.querySelector("[name=startDate]");
const endDateInput = document.querySelector("[name=endDate]");
const fridayCount = document.getElementById("friCount");
let periodInput = document.querySelector("[name=subscriptionPeriod]");
const fridayCounter = (startDate, endDate) => {
  const singleDay = 1000 * 60 * 60 * 24;
  let start = new Date(startDate);
  let end = new Date(endDate);
  let parsedStart = Date.parse(start);
  let parsedEnd = Date.parse(end);
  let friCount = 0;
  for (let d = parsedStart; d <= parsedEnd; d += singleDay) {
    let today = new Date(d).toString();
    if (today.split(" ")[0] === "Fri") {
      ++friCount;
    }
  }
  return friCount;
};
const numberOfDays = (date1, date2) => {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  let timeDifference =
    endDate.getTime() + 1000 * 3600 * 21 - startDate.getTime();
  let daysNumber = timeDifference / (1000 * 3600 * 24);
  return daysNumber;
};
const calcPeriod = (start, end) => {
  return Math.ceil(numberOfDays(start, end));
};

if (startDateInput) {
  startDateInput.addEventListener("change", () => {
    fridayCount.checked = false;
    endDateInput.value = "";
  });
}
if (endDateInput) {
  endDateInput.addEventListener("change", () => {
    periodInput.value = calcPeriod(startDateInput.value, endDateInput.value);
    periodInput.readOnly = true;
  });
}
if (fridayCount) {
  fridayCount.addEventListener("change", (e) => {
    let isNotCounted = e.target.checked;
    if (isNotCounted) {
      let countedFridays = fridayCounter(
        startDateInput.value,
        endDateInput.value
      );
      e.target.value = "on";
      periodInput.value =
        calcPeriod(startDateInput.value, endDateInput.value) - countedFridays;
      periodInput.readOnly = true;
    } else {
      e.target.value = "off";
      periodInput.value = calcPeriod(startDateInput.value, endDateInput.value);
      periodInput.readOnly = true;
    }
  });
}
