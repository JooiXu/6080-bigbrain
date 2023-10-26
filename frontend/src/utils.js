export function base64Image (file) {
  const r = new FileReader();
  const p = new Promise((resolve, reject) => {
    r.onerror = reject;
    r.onload = () => resolve(r.result);
  });
  r.readAsDataURL(file);
  return p;
}

export function sleep (ms = 100) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}
