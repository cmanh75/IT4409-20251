
function simulatedFetch(data, delay = 400) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(JSON.parse(JSON.stringify(data))), delay);
  });
}

function fetchSinhVienById(sid) {
  return simulatedFetch(sinhvien).then(
    (list) => list.find((s) => s.sid === sid) || null
  );
}

function fetchKetQuaBySid(sid) {
  return simulatedFetch(ketqua, 600).then((list) =>
    list.filter((r) => r.sid === sid)
  );
}

function fetchHocPhanByCid(cid) {
  return simulatedFetch(hocphan, 300).then(
    (list) => list.find((c) => c.cid === cid) || null
  );
}

function numericToLetter(score) {
  if (score >= 9.5) return 'A+';
  if (score >= 8.5) return 'A';
  if (score >= 8.0) return 'B+';
  if (score >= 7.0) return 'B';
  if (score >= 6.5) return 'C+';
  if (score >= 5.5) return 'C';
  if (score >= 5.0) return 'D+';
  if (score >= 4.0) return 'D';
  return 'F';
}

function showStatus(text, isLoading = false) {
  const el = document.getElementById('status');
  el.textContent = text;
  el.className = isLoading ? 'loader' : '';
}

function renderTable(rows) {
  if (!rows.length) return '<p class="muted">No results found.</p>';

  const header = `
    <table>
      <thead>
        <tr>
          <th>Course ID</th>
          <th>Course Name</th>
          <th>Credits</th>
          <th>Term</th>
          <th>Score (10)</th>
          <th>Letter</th>
        </tr>
      </thead>
      <tbody>
  `;

  const body = rows
    .map(
      (r) => `
      <tr>
        <td>${r.cid}</td>
        <td>${r.cname || '—'}</td>
        <td>${r.credits ?? '—'}</td>
        <td>${r.term}</td>
        <td>${r.score.toFixed(2)}</td>
        <td>${r.letter}</td>
      </tr>`
    )
    .join('');

  return header + body + '</tbody></table>';
}

async function lookupStudent(sid) {
  const cacheKey = `grades_${sid}`;
  const cached = localStorage.getItem(cacheKey);

  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      document.getElementById(
        'studentInfo'
      ).innerHTML = `<strong>Cached:</strong> ${
        parsed.student ? parsed.student.name + ' (' + parsed.student.sid + ')' : 'unknown'
      }`;
      document.getElementById('results').innerHTML = renderTable(parsed.rows);
      refreshFromNetwork(sid, cacheKey).catch((err) =>
        console.warn('Background refresh failed', err)
      );
      return;
    } catch (e) {
      localStorage.removeItem(cacheKey);
    }
  }

  showStatus('Loading...', true);
  document.getElementById('studentInfo').textContent = '';
  document.getElementById('results').textContent = '';

  try {
    const student = await fetchSinhVienById(sid);
    if (!student) throw new Error('Student not found');

    document.getElementById(
      'studentInfo'
    ).innerHTML = `<strong>${student.name}</strong> — DOB: ${student.dob} (sid: ${student.sid})`;

    const results = await fetchKetQuaBySid(sid);

    const withCoursePromises = results.map(async (r) => {
      const course = await fetchHocPhanByCid(r.cid);
      return {
        cid: r.cid,
        cname: course ? course.name : 'Unknown course',
        credits: course ? course.credits : null,
        term: r.term,
        score: r.score,
        letter: numericToLetter(r.score),
      };
    });

    const rows = await Promise.all(withCoursePromises);

    document.getElementById('results').innerHTML = renderTable(rows);

    localStorage.setItem(
      cacheKey,
      JSON.stringify({ student, rows, cachedAt: new Date().toISOString() })
    );
  } catch (err) {
    document.getElementById(
      'results'
    ).innerHTML = `<p class="muted">Error: ${err.message}</p>`;
  } finally {
    showStatus('', false);
  }
}

async function refreshFromNetwork(sid, cacheKey) {
  try {
    const student = await fetchSinhVienById(sid);
    if (!student) return;

    const results = await fetchKetQuaBySid(sid);

    const withCoursePromises = results.map(async (r) => {
      const course = await fetchHocPhanByCid(r.cid);
      return {
        cid: r.cid,
        cname: course ? course.name : 'Unknown course',
        credits: course ? course.credits : null,
        term: r.term,
        score: r.score,
        letter: numericToLetter(r.score),
      };
    });

    const rows = await Promise.all(withCoursePromises);

    localStorage.setItem(
      cacheKey,
      JSON.stringify({ student, rows, cachedAt: new Date().toISOString() })
    );
  } catch (e) {
    console.warn('Failed to refresh cache', e);
  }
}

const btn = document.getElementById('btnLookup');
btn.addEventListener('click', () => {
  const sid = document.getElementById('sid').value.trim();
  if (!sid) return alert('Please enter a student ID');
  lookupStudent(sid);
});

document.getElementById('sid').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') btn.click();
});
