let data = [];

function analyze() {
  const input = document.getElementById("fileInput");
  const file = input.files[0];
  if (!file) {
    alert("Vui lòng chọn file .csv!");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.trim().split("\n");
    let tai = 0, xiu = 0;
    data = [];

    for (let line of lines) {
      const nums = line.split(',').map(Number);
      const sum = nums.reduce((a, b) => a + b, 0);
      data.push(sum);
      if (sum >= 11) tai++;
      else xiu++;
    }

    updateResults();
    drawChart();
  };
  reader.readAsText(file);
}

function updateResults() {
  const tai = data.filter(sum => sum >= 11).length;
  const xiu = data.length - tai;
  const resultDiv = document.getElementById("results");
  const last = data[data.length - 1];
  const prediction = predictNext();

  resultDiv.innerHTML =
    `<p>Tổng lượt: ${data.length}</p>
     <p>Tài: ${tai} (${(tai/data.length*100).toFixed(1)}%)</p>
     <p>Xỉu: ${xiu} (${(xiu/data.length*100).toFixed(1)}%)</p>
     <p>Dự đoán: <strong>${prediction}</strong></p>`;
}

function predictNext() {
  if (data.length < 3) return "Không đủ dữ liệu";
  const lastThree = data.slice(-3);
  const lastResults = lastThree.map(sum => sum >= 11 ? "Tài" : "Xỉu");
  const lastType = lastResults[2];
  return lastType === lastResults[1] && lastType === lastResults[0]
    ? (lastType === "Tài" ? "Xỉu" : "Tài")
    : lastType;
}

function drawChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, i) => i + 1),
      datasets: [{
        label: "Tổng điểm mỗi lần",
        data: data,
        borderColor: "blue",
        fill: false,
      }]
    },
  });
}
