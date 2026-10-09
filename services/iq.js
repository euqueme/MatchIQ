export const iqQuestions = [
  {q:'Which number completes the sequence: 2,4,8,16,?', a:['24','32','30','28'], c:1},
  {q:'If ALL BLOBS are BLOBSH, and some BLOBS are SLIM, which is possible?', a:['All BLOBSH are SLIM','Some BLOBS are not BLOBSH','All SLIM are BLOBS','None'], c:1},
  {q:'Analogies: Bird is to Fly as Fish is to:', a:['Swim','Run','Climb','Jump'], c:0},
  {q:'What is 15% of 200?', a:['25','30','35','20'], c:1},
  {q:'Which shape has 6 sides?', a:['Triangle','Square','Hexagon','Circle'], c:2}
];

export function renderIQ(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  iqQuestions.forEach((qs, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${idx+1}. ${qs.q}</p>`;
    qs.a.forEach((opt, i) => {
      const id = `iq_${containerId}_${idx}_${i}`;
      div.innerHTML += `<label><input type="radio" name="q${idx}" value="${i}" id="${id}"> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
}

export function renderIQTo(container) {
  container.innerHTML = '';
  iqQuestions.forEach((qs, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `<p>${idx+1}. ${qs.q}</p>`;
    qs.a.forEach((opt, i) => {
      const id = `reg_iq_${idx}_${i}`;
      div.innerHTML += `<label><input type="radio" name="reg_q${idx}" value="${i}" id="${id}"> ${opt}</label><br>`;
    });
    container.appendChild(div);
  });
}
