async function renderClientInfo() {
  const el = document.getElementById("client-info");
  if (!el) return; // important: do nothing on other posts

  const info = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemoryGB: navigator.deviceMemory,
  };

  // Optional: public IP lookup (requires external service)
  try {
    const resp = await fetch("https://api.ipify.org?format=json", {
      cache: "no-store",
    });
    if (resp.ok) {
      const data = await resp.json();
      info.publicIP = data.ip;
    } else {
      info.publicIP = `lookup failed (${resp.status})`;
    }
  } catch (e) {
    info.publicIP = `lookup failed (${String(e)})`;
  }

  el.textContent = JSON.stringify(info, null, 2);
}

renderClientInfo();
