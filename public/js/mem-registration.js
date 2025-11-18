// public/js/membership.js
document.addEventListener('DOMContentLoaded', () => {
  // preserve tab choice on reload
  const tabEl = document.querySelectorAll('#membershipTabs button[data-bs-toggle="tab"]');
  const stored = localStorage.getItem('membershipActiveTab');
  if (stored) {
    const btn = Array.from(tabEl).find(b => b.getAttribute('data-bs-target') === stored);
    if (btn) btn.click();
  }
  tabEl.forEach(b => b.addEventListener('shown.bs.tab', (e) => {
    localStorage.setItem('membershipActiveTab', e.target.getAttribute('data-bs-target'));
  }));

  // Payment mode toggle
  const paymentMode = document.getElementById('paymentMode');
  const paymentDetails = document.getElementById('paymentDetails');
  if (paymentMode) {
    paymentMode.addEventListener('change', () => {
      paymentDetails.style.display = (paymentMode.value === 'bank') ? 'block' : 'none';
    });
  }

  // Image preview (simple)
  const photoInput = document.getElementById('photoInput');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const f = e.target.files[0];
      if (!f) return;
      if (!f.type.startsWith('image/')) return;
      if (f.size > 2 * 1024 * 1024) {
        alert('Photo must be under 2MB');
        e.target.value = '';
        return;
      }
      // optional: show preview by creating an img element or setting background
    });
  }
});
