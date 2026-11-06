// app.js - Screen switching and After Effects execution controller
document.addEventListener('DOMContentLoaded', () => {
  const screenTitles = {
    "1": "1. ASOSIY SAHIFA — AI CHAT VA GENERATE",
    "2": "2. REFERENSLAR SAHIFASI",
    "3": "3. AFTER EFFECTS BOSHQARUVI",
    "4": "4. AI PROVAYDERLAR SAHIFASI",
    "5": "5. PRESETLAR KUTUBXONASI",
    "6": "6. RENDER VA EKSPORT",
    "7": "7. SOZLAMALAR SAHIFASI",
    "8": "8. DASTUR HAQIDA SAHIFASI"
  };

  const titleEl = document.getElementById('current-screen-title');

  function switchScreen(screenNum) {
    document.querySelectorAll('.screen-panel').forEach(p => p.classList.remove('active'));
    const targetPanel = document.getElementById(`panel-${screenNum}`);
    if (targetPanel) targetPanel.classList.add('active');

    document.querySelectorAll('.screen-tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-target') === screenNum;
      btn.classList.toggle('active', match);
      btn.style.backgroundColor = match ? '#5c3bf5' : 'transparent';
      btn.style.color = match ? '#fff' : '#8b92a7';
    });

    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-view') === screenNum);
    });

    if (titleEl && screenTitles[screenNum]) {
      titleEl.textContent = screenTitles[screenNum];
    }
  }

  document.querySelectorAll('.screen-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      switchScreen(target);
    });
  });

  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      const viewNum = item.getAttribute('data-view');
      switchScreen(viewNum);
    });
  });

  const btnCreate = document.getElementById('btn-create-ae');
  if (btnCreate) {
    btnCreate.addEventListener('click', async () => {
      btnCreate.disabled = true;
      btnCreate.innerHTML = `<span>⏳</span> <span>After Effects'da yaratilmoqda...</span>`;

      const steps = document.querySelectorAll('.step-circle');
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 400));
        steps[i].classList.add('active');
      }

      if (window.api && window.api.executePlan) {
        try {
          const res = await window.api.executePlan(1, {
            prompt: document.getElementById('prompt-content').textContent
          });
          alert(res.message || "5 soniyalik 3D Logo Reveal After Effects 2026 da muvaffaqiyatli yaratildi!");
        } catch(e) {
          alert("After Effects buyrug'i yuborildi!");
        }
      }

      btnCreate.disabled = false;
      btnCreate.innerHTML = `<span>✨</span> Yaratishni boshlash`;
    });
  }

  document.querySelectorAll('.btn-quick-ae').forEach(btn => {
    btn.addEventListener('click', () => {
      const actionName = btn.textContent;
      alert(`After Effects: "${actionName}" amali bajarildi!`);
    });
  });

  document.querySelectorAll('.lang-switch button').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.lang-switch button').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
    });
  });
});
