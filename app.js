/* =========================================================
   AQUELE ABRAÇO - MOTOR JAVASCRIPT (V10.1 MODULAR)
   ========================================================= */

const Storage = { 
  get: (k) => { try{ return localStorage.getItem(k); }catch(e){ return null; } }, 
  set: (k,v) => { try{ localStorage.setItem(k,v); }catch(e){} }, 
  remove: (k) => { try{ localStorage.removeItem(k); }catch(e){} } 
};

const API_BACKEND_URL = "https://aquele-abraco.onrender.com/api/chat";
const SECURE_HEADER = "ECLIA_ABRACO_SECURE_KEY_V1";

let state = { 
  session_history: [], 
  internal_header: SECURE_HEADER, 
  voiceSettings: { voiceIndex: 0, pitch: 1.0, rate: 0.95, volume: 1.0, autoAdvance: true },
  theme: 'light',
  zoom: 1
};

window.offlineAIEngine = { isLoaded: false, engine: null };
let deferredPrompt = null;
let currentEmotionalState = "ESTÁVEL";

function autoResizeTextarea(el) { el.style.height = '48px'; el.style.height = Math.min(el.scrollHeight, 140) + "px"; }
function toggleAttachMenu() { document.getElementById('attach-menu').classList.toggle('active'); document.getElementById('emoji-picker-wrapper').classList.remove('open'); }
function toggleEmojiPicker() { document.getElementById('emoji-picker-wrapper').classList.toggle('open'); document.getElementById('attach-menu').classList.remove('active'); }

const cbtSuggestions = {
  "ansiedade_leve": [ { "label": "📊 Medir Grau de Ansiedade e Tensão", "action": "METER_ANSIEDADE" } ],
  "crise_fisica": [ { "label": "📊 Medir Dor / Fadiga", "action": "METER_DOR" }, { "label": "🧘 Técnica 5-4-3-2-1", "action": "TECNICA_54321" }, { "label": "🎧 Som Binaural 432Hz", "action": "PLAY_432" } ],
  "tristeza_profunda": [ { "label": "📊 Medir Nível de Tristeza", "action": "METER_TRISTEZA" } ],
  "sobrecarga_sensorial": [ { "label": "🔊 Ativar Som de Reset Cognitivo", "action": "PLAY_852" } ]
};

window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredPrompt = e; });
window.triggerPWAInstall = async function() { if (deferredPrompt) { deferredPrompt.prompt(); await deferredPrompt.userChoice; deferredPrompt = null; } else { showToast("💝 O aplicativo já foi instalado, ou você está no iPhone."); } }

window.addEventListener('load', () => {
  const canvas = document.getElementById('logoCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d'); let startTime = null;
    function animateLogo(timestamp) {
      if (!startTime) startTime = timestamp; let t = ((timestamp - startTime) % 6000) / 6000;
      let hugProgress = 0; if (t > 0.4 && t <= 0.6) hugProgress = (t - 0.4) / 0.2; else if (t > 0.6 && t <= 0.9) hugProgress = 1; else if (t > 0.9) hugProgress = 1 - (t - 0.9) / 0.1;
      ctx.clearRect(0, 0, canvas.width, canvas.height); let strokeColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim(); let squeeze = hugProgress * 18; let sway = Math.sin(t * Math.PI * 2) * (hugProgress * 4);
      ctx.save(); ctx.translate(200 + sway, 200); ctx.beginPath(); ctx.strokeStyle = strokeColor; ctx.lineWidth = 4.5; ctx.moveTo(0, 110); ctx.bezierCurveTo(-60 + squeeze, 70, -110 + squeeze, 30, -110 + squeeze, -30); ctx.bezierCurveTo(-110 + squeeze, -80, -40, -100, 0, -40); ctx.bezierCurveTo(40, -100, 110 - squeeze, -80, 110 - squeeze, -30); ctx.bezierCurveTo(110 - squeeze, 30, 60 - squeeze, 70, 0, 110); ctx.stroke();
      if (hugProgress > 0.3) { let alpha = (hugProgress - 0.3) / 0.7; ctx.strokeStyle = strokeColor; ctx.lineWidth = 2.5; ctx.globalAlpha = alpha; ctx.beginPath(); ctx.moveTo(-95 + squeeze, 10); ctx.quadraticCurveTo(-85 + squeeze, 20, -90 + squeeze, 30); ctx.moveTo(95 - squeeze, 10); ctx.quadraticCurveTo(85 - squeeze, 20, 90 - squeeze, 30); ctx.stroke(); ctx.globalAlpha = 1.0; }
      if (hugProgress < 0.5) { ctx.fillStyle = strokeColor; ctx.beginPath(); ctx.arc(-35, -25, 4.5, 0, Math.PI * 2); ctx.arc(35, -25, 4.5, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.lineWidth = 3.5; ctx.arc(0, 5, 25, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); } else { ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(-35, -30, 12, 0.1 * Math.PI, 0.9 * Math.PI); ctx.moveTo(47, -30); ctx.arc(35, -30, 12, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 10, 18, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
      let armAngle = hugProgress * 1.45; ctx.save(); ctx.translate(-95 + squeeze, 0); ctx.rotate(armAngle); ctx.beginPath(); ctx.lineWidth = 4; ctx.moveTo(0, 0); ctx.bezierCurveTo(20, 40, 60, 60, 110, 45); ctx.stroke(); if (hugProgress > 0.6) { ctx.beginPath(); ctx.lineWidth = 2.5; ctx.moveTo(110, 45); ctx.lineTo(125, 38); ctx.moveTo(110, 45); ctx.lineTo(128, 43); ctx.moveTo(110, 45); ctx.lineTo(127, 49); ctx.moveTo(110, 45); ctx.lineTo(123, 54); ctx.stroke(); } ctx.restore();
      ctx.save(); ctx.translate(95 - squeeze, 0); ctx.rotate(-armAngle); ctx.beginPath(); ctx.lineWidth = 4; ctx.moveTo(0, 0); ctx.bezierCurveTo(-20, 40, -60, 60, -110, 45); ctx.stroke(); if (hugProgress > 0.6) { ctx.beginPath(); ctx.lineWidth = 2.5; ctx.moveTo(-110, 45); ctx.lineTo(-125, 38); ctx.moveTo(-110, 45); ctx.lineTo(-128, 43); ctx.moveTo(-110, 45); ctx.lineTo(-127, 49); ctx.moveTo(-110, 45); ctx.lineTo(-123, 54); ctx.stroke(); } ctx.restore(); ctx.restore(); requestAnimationFrame(animateLogo);
    }
    requestAnimationFrame(animateLogo);
  }

  try { let stats = JSON.parse(Storage.get('abraco_telemetry')) || { sessoes: 0 }; stats.sessoes += 1; Storage.set('abraco_telemetry', JSON.stringify(stats)); } catch(e){}
  try { loadState(); } catch(e){ state.session_history = []; renderHistory(); }
  try { initCanvas(); window.addEventListener('online', updateNetworkStatus); window.addEventListener('offline', updateNetworkStatus); updateNetworkStatus(); initVoices(); } catch(e){}

  setTimeout(() => {
    try { document.getElementById('logo-anchor').appendChild(document.getElementById('hero-wrapper')); document.getElementById('hero-wrapper').classList.add('minimized'); document.getElementById('brand-title').classList.add('visible'); document.getElementById('chat-container').classList.add('visible'); } catch (e) { document.getElementById('hero-wrapper').style.display = 'none'; document.getElementById('chat-container').style.opacity = '1'; }
  }, 3500); 
});

function updateNetworkStatus() { const b = document.getElementById('network-badge'); if (navigator.onLine) { b.textContent = 'Online'; b.className = 'network-badge badge-online'; } else if (window.offlineAIEngine && window.offlineAIEngine.isLoaded) { b.textContent = 'IA Local'; b.className = 'network-badge badge-ai-local'; } else { b.textContent = 'Offline'; b.className = 'network-badge badge-offline'; } }

function openModal(id) { document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active')); document.getElementById(id).classList.add('active'); if(id === 'settings-modal') populateVoices(); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function toggleAccordion(button) { const item = button.parentElement; const isOpen = item.classList.contains('open'); document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open')); if (!isOpen) { item.classList.add('open'); setTimeout(() => { const mb = item.closest('.modal-body'); if(mb) mb.scrollTo({ top: item.offsetTop - 20, behavior: 'smooth' }); }, 300); } }
function showToast(msg) { const t = document.getElementById('toast-notification'); t.innerText = msg; t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 4500); }
function triggerPanicLock() { document.getElementById('panic-screen').style.display = 'flex'; }
function triggerEmergencyDial() { window.location.href = 'tel:190'; }

window.clearChatMemory = function() { if(confirm("Apagar histórico e memória do dispositivo?")) { state.session_history = []; Storage.set('aquele_abraco_state', JSON.stringify(state)); renderHistory(); currentEmotionalState = "ESTÁVEL"; showToast("🧹 Memória apagada."); closeModal('settings-modal'); } }

function setTheme(theme) { document.body.className = ''; if (theme !== 'light') document.body.classList.add(`theme-${theme}`); state.theme = theme; Storage.set('aquele_abraco_state', JSON.stringify(state));}
function setBrightness(val) { document.documentElement.style.setProperty('--screen-brightness', val); }
function setZoom(val) { document.documentElement.style.setProperty('--zoom-factor', val); state.zoom = val; Storage.set('aquele_abraco_state', JSON.stringify(state));}

window.toggleGlosaText = function(text, parentElem) {
  let glosaBox = parentElem.querySelector('.glosa-box');
  if (!glosaBox) {
    glosaBox = document.createElement('div'); glosaBox.className = 'glosa-box';
    let glosa = text.toUpperCase().replace(/[.,!?;\(\)\[\]"']/g, '');
    const stopWords = [' O ', ' A ', ' OS ', ' AS ', ' UM ', ' UMA ', ' UNS ', ' UMAS ', ' DE ', ' DO ', ' DA ', ' DOS ', ' DAS ', ' EM ', ' NO ', ' NA ', ' NOS ', ' NAS ', ' POR ', ' PARA ', ' COM ', ' QUE ', ' SE '];
    stopWords.forEach(w => { glosa = glosa.split(w).join(' '); });
    if(glosa.startsWith('O ')) glosa = glosa.substring(2); if(glosa.startsWith('A ')) glosa = glosa.substring(2);
    glosaBox.innerText = `🤟 ESTRUTURA GLOSA:\n${glosa.replace(/\s+/g, ' ').trim()}`;
    parentElem.appendChild(glosaBox); setTimeout(() => glosaBox.classList.add('visible'), 10);
  } else { glosaBox.classList.toggle('visible'); }
}

window.renderEmotionMeters = function(btnElement, metricsConfig) {
  const card = document.createElement('div'); card.className = 'emotion-sliders-card';
  const title = document.createElement('p'); title.style.fontSize = '1.05rem'; title.style.color = 'var(--primary-color)'; title.style.marginBottom = '10px'; title.style.fontWeight = 'bold'; title.innerText = "Toque ou deslize as barras de 0 a 10:"; card.appendChild(title);
  const slidersData = [];
  metricsConfig.forEach(metric => {
    const row = document.createElement('div'); row.className = 'emotion-slider-row';
    const labelBox = document.createElement('div'); labelBox.className = 'emotion-label';
    const nameSpan = document.createElement('span'); nameSpan.innerText = metric.label;
    const valSpan = document.createElement('span'); valSpan.className = 'emotion-val-display'; valSpan.innerText = "5";
    labelBox.appendChild(nameSpan); labelBox.appendChild(valSpan);
    const range = document.createElement('input'); range.type = 'range'; range.className = 'emotion-range'; range.min = 0; range.max = 10; range.step = 1; range.value = 5;
    range.oninput = function() { valSpan.innerText = this.value; };
    row.appendChild(labelBox); row.appendChild(range); card.appendChild(row); slidersData.push({ name: metric.label, input: range });
  });
  const submitBtn = document.createElement('button'); submitBtn.className = 'emotion-submit-btn'; submitBtn.innerText = "Confirmar Nível";
  submitBtn.onclick = () => {
    let textResult = "[Escala SUDS]\n"; slidersData.forEach(item => { textResult += `Meu nível de ${item.name} é: ${item.input.value} de 10.\n`; });
    submitBtn.innerText = "✓ Medição Salva"; submitBtn.disabled = true; submitBtn.style.background = "var(--border-color)"; submitBtn.style.color = "var(--primary-color)"; slidersData.forEach(item => item.input.disabled = true);
    appendMessage(textResult.trim(), 'user'); processUserMessageWithCascade(textResult.trim()).then(res => { let clean = res.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(); appendMessage(clean, 'assistant', true, res.suggestedCBT); });
  };
  card.appendChild(submitBtn); btnElement.parentElement.appendChild(card); btnElement.remove();
}

window.executeCBTSuggestion = function(actionCode, btnElement) {
  if (actionCode === 'METER_ANSIEDADE') { window.renderEmotionMeters(btnElement, [ { label: 'Ansiedade / Pânico' }, { label: 'Preocupação Invasiva' } ]); return; }
  else if (actionCode === 'METER_DOR') { window.renderEmotionMeters(btnElement, [ { label: 'Dor Física Geral' }, { label: 'Sensação de Fadiga' } ]); return; }
  else if (actionCode === 'METER_TRISTEZA') { window.renderEmotionMeters(btnElement, [ { label: 'Grau de Tristeza' }, { label: 'Vazio / Apatia' } ]); return; }
  if (actionCode === 'PLAY_432') playAcoustic('binaural'); else if (actionCode === 'PLAY_852') playAcoustic('reset'); else if (actionCode === 'OPEN_ART') openCanvas(); else if (actionCode === 'TECNICA_54321') { appendMessage("Técnica de Aterramento:\nOlhe ao redor devagar. Encontre:\n👀 5 coisas que pode ver.\n✋ 4 coisas que pode tocar.\n👂 3 sons.\n👃 2 cheiros.\n❤️ 1 coisa boa.", 'assistant', false); }
  btnElement.innerText = "✓ " + btnElement.innerText; btnElement.style.background = "var(--border-color)"; btnElement.disabled = true;
}

window.downloadRealAI = async function() {
  if (!navigator.gpu) { alert("WebGPU indisponível no navegador."); return; }
  if (!confirm("Isso baixará o motor de Inteligência (~600MB). Use Wi-Fi. Iniciar?")) return; 
  const btn = document.getElementById('download-ai-btn'); btn.innerText = "Construindo Rede Neural..."; btn.disabled = true;
  try {
    const { CreateMLCEngine } = await import('https://esm.run/@mlc-ai/web-llm');
    window.offlineAIEngine.engine = await CreateMLCEngine("TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC", { initProgressCallback: (p) => btn.innerText = `Baixando IA: ${Math.round(p.progress * 100)}%` });
    window.offlineAIEngine.isLoaded = true; Storage.set('ia_offline_instalada', 'true');
    btn.innerText = "🧠 Motor Local Ativo"; alert("O cérebro agora mora no seu celular."); updateNetworkStatus();
  } catch (error) { btn.innerText = "Erro ao baixar"; btn.disabled = false; }
};

let cameraStream = null; let mediaRecorder = null; let recordedChunks = [];
async function openCameraModal() { openModal('camera-modal'); const video = document.getElementById('webcam-preview'); try { cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false }); video.srcObject = cameraStream; } catch (err) { alert("Erro de acesso à câmera."); closeModal('camera-modal'); } }
function closeCameraModal() { closeModal('camera-modal'); if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop(); if (cameraStream) { cameraStream.getTracks().forEach(track => track.stop()); cameraStream = null; } }
function captureSignLanguage() {
  if (!cameraStream) return; const durationSelect = document.getElementById('videoDuration'); const recordTimeMs = parseInt(durationSelect ? durationSelect.value : 5000) || 5000; const recordTimeSec = (recordTimeMs / 1000).toFixed(1);
  recordedChunks = []; const btn = document.getElementById('captureLibrasBtn'); btn.innerText = `Gravando... Olhe para a câmera.`; btn.disabled = true; if (durationSelect) durationSelect.disabled = true;
  try { mediaRecorder = new MediaRecorder(cameraStream, { mimeType: 'video/webm' }); } catch (e) { mediaRecorder = new MediaRecorder(cameraStream); }
  mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) recordedChunks.push(e.data); };
  mediaRecorder.onstop = () => {
    closeCameraModal(); btn.innerText = "🔴 Iniciar Gravação"; btn.disabled = false; if (durationSelect) durationSelect.disabled = false; 
    appendMessage(`[Mídia Recebida: Vídeo Frontal - ${recordTimeSec}s]`, 'user');
    const hiddenContext = `[SISTEMA MULTIMODAL]: O paciente enviou um vídeo expressivo (sinais, gestos, choro). Responda IMEDIATAMENTE dizendo que "viu", compreende a profundidade do sentimento dele, acolha a emoção e faça uma pergunta empática.`;
    processUserMessageWithCascade(hiddenContext).then(res => { let c = res.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(); appendMessage(c, 'assistant', true, res.suggestedCBT); });
  };
  mediaRecorder.start(); setTimeout(() => { if (mediaRecorder && mediaRecorder.state === 'recording') mediaRecorder.stop(); }, recordTimeMs);
}

let artCanvas, artCtx, drawing = false, currentTool = 'pen', strokeColor = '#333333'; let currentToolBtn = null;
function initCanvas() { artCanvas = document.getElementById('artCanvas'); if(!artCanvas) return; artCtx = artCanvas.getContext('2d'); artCanvas.addEventListener('mousedown', startDraw); artCanvas.addEventListener('mousemove', draw); artCanvas.addEventListener('mouseup', stopDraw); artCanvas.addEventListener('touchstart', startDraw, {passive:false}); artCanvas.addEventListener('touchmove', draw, {passive:false}); artCanvas.addEventListener('touchend', stopDraw); }
function openCanvas() { document.getElementById('canvas-modal').style.display = 'flex'; artCanvas.width = window.innerWidth; artCanvas.height = window.innerHeight - 150; artCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color').trim(); artCtx.fillRect(0, 0, artCanvas.width, artCanvas.height); }
function closeCanvas() { document.getElementById('canvas-modal').style.display = 'none'; appendMessage("[Mídia Recebida: Lousa de Expressão Visual]", 'user'); const hiddenContext = `[SISTEMA MULTIMODAL]: O paciente fechou a lousa desenhando sentimentos abstratos. Assuma o papel empático que "sente" a arte. Acolha e pergunte o que isso representou.`; processUserMessageWithCascade(hiddenContext).then(res => appendMessage(res.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(), 'assistant', true, res.suggestedCBT)); }
function setTool(btn, tool) { currentTool = tool; if(currentToolBtn) currentToolBtn.style.background = 'var(--bg-color)'; currentToolBtn = btn; btn.style.background = 'rgba(0,0,0,0.1)';} 
function setColor(dot, color) { document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('selected')); dot.classList.add('selected'); strokeColor = color; currentTool = 'pen'; } 
function clearCanvas() { artCtx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-color').trim(); artCtx.fillRect(0, 0, artCanvas.width, artCanvas.height); }
function startDraw(e) { e.preventDefault(); drawing = true; draw(e); } function stopDraw() { drawing = false; artCtx.beginPath(); }
function draw(e) { if (!drawing) return; e.preventDefault(); const rect = artCanvas.getBoundingClientRect(); const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left; const y = (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top; artCtx.lineWidth = currentTool === 'eraser' ? 35 : 4; artCtx.lineCap = 'round'; artCtx.lineJoin = 'round'; artCtx.strokeStyle = currentTool === 'eraser' ? getComputedStyle(document.body).getPropertyValue('--bg-color').trim() : strokeColor; artCtx.lineTo(x, y); artCtx.stroke(); artCtx.beginPath(); artCtx.moveTo(x, y); }

function handleFileUpload(event) { const file = event.target.files[0]; if (!file) return; document.getElementById('attach-menu').classList.remove('active'); appendMessage(`[Anexo: ${file.name}]`, 'user'); const hiddenContext = `[SISTEMA MULTIMODAL]: O paciente anexou "${file.name}". Confirme o recebimento, diga que está criptografado e pergunte o que significa.`; processUserMessageWithCascade(hiddenContext).then(res => appendMessage(res.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(), 'assistant', true, res.suggestedCBT)); }

let isListening = false, recognition;
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) { const Speech = window.SpeechRecognition || window.webkitSpeechRecognition; recognition = new Speech(); recognition.lang = 'pt-BR'; recognition.continuous = false; recognition.interimResults = false; recognition.onresult = (e) => { const input = document.getElementById('userInput'); input.value += e.results[0][0].transcript + " "; autoResizeTextarea(input); toggleVoice(); }; recognition.onerror = () => toggleVoice(); recognition.onend = () => { if(isListening) toggleVoice(); }; }
function toggleVoice() { const btn = document.getElementById('voiceBtn'); if (!recognition) return alert('O Microfone foi bloqueado no navegador.'); if (!isListening) { try { recognition.start(); isListening = true; btn.classList.add('voice-active'); } catch(e){} } else { recognition.stop(); isListening = false; btn.classList.remove('voice-active'); } }

let synthAudioCtx = null; let synthNodes = []; let isMonoOutput = false;
function toggleMono(checkbox) { isMonoOutput = checkbox.checked; showToast(isMonoOutput ? "Atenção: Modo Mono Ativado." : "Estéreo Restaurado."); }
async function initSynthAudio() { if (!synthAudioCtx) { synthAudioCtx = new (window.AudioContext || window.webkitAudioContext)(); } if (synthAudioCtx.state === 'suspended') { await synthAudioCtx.resume(); } }
function stopSyntheticAudio() { synthNodes.forEach(node => { try { node.stop(); } catch(e) {} }); synthNodes = []; }
function createPinkNoise() { const bufferSize = 2 * synthAudioCtx.sampleRate; const noiseBuffer = synthAudioCtx.createBuffer(1, bufferSize, synthAudioCtx.sampleRate); const output = noiseBuffer.getChannelData(0); let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0; for (let i = 0; i < bufferSize; i++) { let white = Math.random() * 2 - 1; b0 = 0.99886 * b0 + white * 0.0555179; b1 = 0.99332 * b1 + white * 0.0750759; b2 = 0.96900 * b2 + white * 0.1538520; b3 = 0.86650 * b3 + white * 0.3104856; b4 = 0.55000 * b4 + white * 0.5329522; b5 = -0.7616 * b5 - white * 0.0168980; output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362; output[i] *= 0.11; b6 = white * 0.115926; } return noiseBuffer; }
function playSolfeggio(freq, isBinaural = false) { stopSyntheticAudio(); const oscL = synthAudioCtx.createOscillator(); oscL.type = 'sine'; oscL.frequency.value = freq; let oscR = null; const panL = synthAudioCtx.createStereoPanner ? synthAudioCtx.createStereoPanner() : synthAudioCtx.createPanner(); const panR = synthAudioCtx.createStereoPanner ? synthAudioCtx.createStereoPanner() : synthAudioCtx.createPanner(); if (isMonoOutput) { if(panL.pan) panL.pan.value = 0; else panL.setPosition(0, 0, 0); if(panR.pan) panR.pan.value = 0; else panR.setPosition(0, 0, 0); } else { if(panL.pan) panL.pan.value = -1; else panL.setPosition(-1, 0, 0); if(panR.pan) panR.pan.value = 1; else panR.setPosition(1, 0, 0); } const gain = synthAudioCtx.createGain(); gain.gain.value = 0.15; oscL.connect(panL); panL.connect(gain); oscL.start(); synthNodes.push(oscL); if (isBinaural) { oscR = synthAudioCtx.createOscillator(); oscR.type = 'sine'; oscR.frequency.value = freq + 4; oscR.connect(panR); panR.connect(gain); oscR.start(); synthNodes.push(oscR); } gain.connect(synthAudioCtx.destination); }
function playRain() { stopSyntheticAudio(); const noiseSource = synthAudioCtx.createBufferSource(); noiseSource.buffer = createPinkNoise(); noiseSource.loop = true; const filter = synthAudioCtx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 1000; const gain = synthAudioCtx.createGain(); gain.gain.value = 0.5; noiseSource.connect(filter); filter.connect(gain); gain.connect(synthAudioCtx.destination); noiseSource.start(); synthNodes.push(noiseSource); }
window.playAcoustic = async function(track) { const player = document.getElementById('ambientPlayer'); player.pause(); stopSyntheticAudio(); closeModal('audio-modal'); try { await initSynthAudio(); if (track === 'chuva') { playRain(); showToast("🌧️ Som de Chuva Reparadora ativo."); } else if (track === '174') { playSolfeggio(174, false); showToast("🩹 174Hz (Alívio) Ativo."); } else if (track === 'binaural') { playSolfeggio(432, true); showToast("🌊 Binaural 432Hz (Calma) Ativo."); } else if (track === '528') { playSolfeggio(528, false); showToast("🧬 528Hz (Cura) Ativo."); } else if (track === '852') { playSolfeggio(852, false); showToast("⚡ 852Hz (Reset) Ativo."); } else if (track === 'mindfulness') { player.src = 'https://ice1.somafm.com/dronezone-128-mp3'; player.volume = 0.2; showToast("🧘‍♂️ Carregando Rádio..."); player.play(); } } catch (e) { showToast("⚠️ Áudio bloqueado pelo aparelho."); } }
window.stopAcoustic = function() { const player = document.getElementById('ambientPlayer'); player.pause(); stopSyntheticAudio(); closeModal('audio-modal'); showToast("⏹️ Silêncio restaurado."); }

let currentSpeakingPElem = null; let isSpeechPaused = false;
function resetAudioState() { document.querySelectorAll('.paragraph-item').forEach(p => { p.classList.remove('speaking'); const footer = p.querySelector('.player-controls'); if (footer) footer.remove(); const defaultBtns = p.querySelector('.access-btns'); if (defaultBtns) defaultBtns.style.display = 'flex'; }); currentSpeakingPElem = null; isSpeechPaused = false; }
function initVoices() { if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = () => populateVoices(); }
function populateVoices() { if (!('speechSynthesis' in window)) return; const select = document.getElementById('voiceSelect'); if (!select) return; const voices = window.speechSynthesis.getVoices(); select.innerHTML = ''; const ptVoices = voices.filter(v => v.lang.includes('pt')); if (ptVoices.length > 0) { const groupPt = document.createElement('optgroup'); groupPt.label = "Vozes Nativas"; ptVoices.forEach(v => { const opt = document.createElement('option'); opt.value = voices.indexOf(v); opt.textContent = v.name; groupPt.appendChild(opt); }); select.appendChild(groupPt); } if (state.voiceSettings && voices[state.voiceSettings.voiceIndex]) select.value = state.voiceSettings.voiceIndex; }
function applyVoicePreset(presetName) { const p = document.getElementById('voicePitch'), r = document.getElementById('voiceRate'); if (presetName === 'acolhedora') { p.value = 0.95; r.value = 0.85; } else if (presetName === 'serena') { p.value = 0.85; r.value = 0.75; } else if (presetName === 'energique') { p.value = 1.15; r.value = 1.05; } else { p.value = 1.0; r.value = 0.95; } updateVoiceSettings(); }
function updateVoiceSettings() { state.voiceSettings = { voiceIndex: parseInt(document.getElementById('voiceSelect').value) || 0, pitch: parseFloat(document.getElementById('voicePitch').value) || 1.0, rate: parseFloat(document.getElementById('voiceRate').value) || 0.95, volume: 1.0, autoAdvance: true }; document.getElementById('pitchVal').innerText = state.voiceSettings.pitch; document.getElementById('rateVal').innerText = state.voiceSettings.rate; Storage.set('aquele_abraco_state', JSON.stringify(state)); }
function testVoiceSettings() { updateVoiceSettings(); window.speechSynthesis.cancel(); resetAudioState(); const utt = new SpeechSynthesisUtterance("Este é um teste da voz humanizada."); utt.lang = 'pt-BR'; const voices = window.speechSynthesis.getVoices(); if (voices[state.voiceSettings.voiceIndex]) utt.voice = voices[state.voiceSettings.voiceIndex]; utt.pitch = state.voiceSettings.pitch; utt.rate = state.voiceSettings.rate; window.speechSynthesis.speak(utt); }

window.readGenericText = function(text, btnElem) { if (!('speechSynthesis' in window)) return alert("Síntese indisponível."); if (window.speechSynthesis.speaking && btnElem.innerText === '⏹️') { window.speechSynthesis.cancel(); resetAudioState(); return; } window.speechSynthesis.cancel(); resetAudioState(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'pt-BR'; const voices = window.speechSynthesis.getVoices(); if (state.voiceSettings && voices[state.voiceSettings.voiceIndex]) { utterance.voice = voices[state.voiceSettings.voiceIndex]; utterance.pitch = state.voiceSettings.pitch; utterance.rate = state.voiceSettings.rate; } else utterance.rate = 0.95; utterance.onend = () => resetAudioState(); utterance.onerror = () => resetAudioState(); btnElem.innerText = '⏹️'; window.speechSynthesis.speak(utterance); }
window.toggleAccordionAudio = function(event, btnElem) { event.stopPropagation(); const item = btnElem.closest('.accordion-item'); if (!item.classList.contains('open')) { document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open')); item.classList.add('open'); } readGenericText(item.querySelector('.accordion-content').innerText, btnElem); }
window.toggleAccordionLibras = function(event, btnElem) { event.stopPropagation(); const item = btnElem.closest('.accordion-item'); if (!item.classList.contains('open')) { document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open')); item.classList.add('open'); } window.toggleGlosaText(item.querySelector('.accordion-content').innerText, item.querySelector('.accordion-content')); }

window.playParagraph = function(pElem) {
  if (!('speechSynthesis' in window)) return alert("Fala sintética não suportada.");
  window.speechSynthesis.cancel(); resetAudioState(); if (!pElem) return;
  const utterance = new SpeechSynthesisUtterance(pElem.querySelector('.paragraph-text').innerText); utterance.lang = 'pt-BR';
  const voices = window.speechSynthesis.getVoices(); 
  if (state.voiceSettings && voices[state.voiceSettings.voiceIndex]) { utterance.voice = voices[state.voiceSettings.voiceIndex]; utterance.pitch = state.voiceSettings.pitch; utterance.rate = state.voiceSettings.rate; }
  utterance.onend = () => { if(isSpeechPaused) return; pElem.classList.remove('speaking'); currentSpeakingPElem = null; if (state.voiceSettings?.autoAdvance) { let next = pElem.nextElementSibling; if (next && next.classList.contains('paragraph-item')) { setTimeout(() => playParagraph(next), 250); } else { resetAudioState(); } } else { resetAudioState(); } };
  utterance.onerror = () => resetAudioState();
  pElem.classList.add('speaking'); currentSpeakingPElem = pElem; isSpeechPaused = false;
  const defaultBtns = pElem.querySelector('.access-btns'); if (defaultBtns) defaultBtns.style.display = 'none';
  const playerDiv = document.createElement('div'); playerDiv.className = 'player-controls'; playerDiv.innerHTML = `<button class="access-btn" title="Repetir Parágrafo Anterior" onclick="skipAudio(-1, event)">⏮️</button><button class="access-btn" title="Pausar / Retomar Leitura" id="pauseBtn" onclick="togglePause(event)">⏸️</button><button class="access-btn" title="Pular Parágrafo" onclick="skipAudio(1, event)">⏭️</button><button class="access-btn" title="Parar Emissão" onclick="stopAllAudio(event)">⏹️</button>`;
  pElem.appendChild(playerDiv); window.speechSynthesis.speak(utterance);
}
window.skipAudio = function(direction, event) { if(event) event.stopPropagation(); if(!currentSpeakingPElem) return; let targetElem = direction === 1 ? currentSpeakingPElem.nextElementSibling : currentSpeakingPElem.previousElementSibling; if (targetElem && targetElem.classList.contains('paragraph-item')) { playParagraph(targetElem); } else if (direction === -1) { playParagraph(currentSpeakingPElem); } else { stopAllAudio(); } }
window.togglePause = function(event) { if(event) event.stopPropagation(); if (!currentSpeakingPElem) return; const pauseBtn = currentSpeakingPElem.querySelector('#pauseBtn'); if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) { window.speechSynthesis.pause(); isSpeechPaused = true; if(pauseBtn) pauseBtn.innerText = '▶️'; } else if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); isSpeechPaused = false; if(pauseBtn) pauseBtn.innerText = '⏸️'; } }
window.stopAllAudio = function(event) { if(event) event.stopPropagation(); window.speechSynthesis.cancel(); resetAudioState(); }

async function processUserMessageWithCascade(userText) {
  const txt = userText.toUpperCase(); let suggestedCBT = null;
  if (/\b(CORAÇÃO|FALTA DE AR|DOR|SUOR|TREMOR|FADIGA|CANSAÇO|CANSADA)\b/.test(txt)) suggestedCBT = 'crise_fisica';
  else if (/\b(ANSIEDADE|ANSIOSA|PREOCUPADA|MEDO|AGITADA|EMPOLGADA)\b/.test(txt) || currentEmotionalState === "ALERTA_PÂNICO") suggestedCBT = 'ansiedade_leve';
  else if (/\b(TRISTE|CHORO|DEPRIMIDA|TÉDIO|DESANIMADA|FRUSTRADA)\b/.test(txt)) suggestedCBT = 'tristeza_profunda';
  else if (/\b(BARULHO|CABEÇA|PENSAMENTO|MUITO|SOBRECARGA|CONFUSÃO|GRITO)\b/.test(txt)) suggestedCBT = 'sobrecarga_sensorial';

  const currentTime = new Date().toLocaleString('pt-BR');
  let historyContext = state.session_history.slice(-8).map(msg => `[${msg.sender === 'user' ? 'Paciente' : 'Assistente'}]: ${msg.text}`).join('\n');
  const systemPrompt = `Você é o software de saúde mental 'Aquele Abraço'. Local/Hora atual do paciente: ${currentTime}.\nHistórico:\n${historyContext}\n\nMANDATO CLÍNICO: O paciente te envia gráficos emojis ou ações entre colchetes [Contexto Clínico...]. Não ignore os ícones nem revele a marcação de sistema, atue com base neles e valide incondicionalmente a emoção. Mantenha os parágrafos curtos.`;

  if (navigator.onLine) {
    try {
      const controller = new AbortController(); setTimeout(() => controller.abort(), 12000); 
      const payload = { message: userText, history: state.session_history };
      const response = await fetch(API_BACKEND_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: controller.signal });
      if (response.ok) { const data = await response.json(); return { text: data.response || "Estou aqui com você.", source: 'NUVEM', suggestedCBT }; }
    } catch (error) {}
  }

  if (window.offlineAIEngine && window.offlineAIEngine.isLoaded && window.offlineAIEngine.engine) {
    try {
      const result = await window.offlineAIEngine.engine.chat.completions.create({ messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `[${currentTime}] Relato: ${userText}` }] });
      return { text: result.choices[0].message.content, source: 'WEBLLM_CACHE', suggestedCBT };
    } catch (error) {}
  }

  if (navigator.onLine) return { text: "Minha infraestrutura de internet está com falha severa. Quer utilizar uma régua emocional no chat para medir sua ansiedade hoje?", source: 'NUVEM_TIMEOUT', suggestedCBT: suggestedCBT || 'ansiedade_leve' };
  return { text: "Estou blindado e operando no Modo de Segurança Offline. Como prefere continuar?", source: 'TCC_CHATBOT', suggestedCBT: suggestedCBT || 'ansiedade_leve' }; 
}

async function sendMessage() { 
  const input = document.getElementById('userInput'); const text = input.value.trim(); 
  if (!text) return; 
  appendMessage(text, 'user'); input.value = ''; input.style.height = '52px'; document.getElementById('emoji-picker-wrapper').classList.remove('open'); document.getElementById('attach-menu').classList.remove('active');
  const typingId = "typing-" + Date.now(); appendMessage("Analisando as intenções no servidor...", 'assistant', false, null, typingId);
  
  const result = await processUserMessageWithCascade(text);
  const typingElem = document.getElementById(typingId); if (typingElem) typingElem.remove();

  const badge = document.getElementById('network-badge');
  if (result.source === 'TCC_CHATBOT' || result.source === 'NUVEM_TIMEOUT') { badge.textContent = 'Offline'; badge.className = 'network-badge badge-offline'; } 
  else if (result.source === 'NUVEM') { badge.textContent = 'Conectado (Nuvem)'; badge.className = 'network-badge badge-online'; } 
  else { badge.textContent = 'Motor de IA Ativo'; badge.className = 'network-badge badge-ai-local'; }

  let cleanText = result.text.replace(/<think>[\s\S]*?<\/think>/gi, '').replace(/^(?:\*|-|\d+\.).*$/gm, '').trim();
  appendMessage(cleanText || "Sinta-se abraçado no meu silêncio.", 'assistant', true, result.suggestedCBT);
}

function appendMessage(text, sender, save = true, suggestedCBT = null, forceId = null) {
  const container = document.getElementById('chat-container'); const msgDiv = document.createElement('div'); msgDiv.className = `message ${sender}`; 
  if (forceId) msgDiv.id = forceId;
  if (!text || typeof text !== 'string') text = "...";

  if (sender === 'assistant') {
    const paragraphs = text.split(/\n+/).map(p => p.trim()).filter(p => p.length > 0);
    if (paragraphs.length === 0) paragraphs.push(text);

    paragraphs.forEach((pText) => {
      const pElem = document.createElement('div'); pElem.className = 'paragraph-item'; pElem.title = "Toque para iniciar ou parar a voz.";
      pElem.onclick = (e) => { if(e.target.tagName === 'BUTTON') return; if (currentSpeakingPElem === pElem) { togglePause(); } else { playParagraph(pElem); } };
      const textSpan = document.createElement('span'); textSpan.className = 'paragraph-text'; textSpan.innerText = pText;
      const btnContainer = document.createElement('div'); btnContainer.className = 'access-btns';
      const audioBtn = document.createElement('button'); audioBtn.className = 'access-btn'; audioBtn.innerText = '🔊'; audioBtn.onclick = (e) => { e.stopPropagation(); playParagraph(pElem); };
      const librasBtn = document.createElement('button'); librasBtn.className = 'access-btn'; librasBtn.innerText = '🤟'; librasBtn.onclick = (e) => { e.stopPropagation(); window.toggleGlosaText(pText, pElem); };
      btnContainer.appendChild(audioBtn); btnContainer.appendChild(librasBtn); pElem.appendChild(textSpan); pElem.appendChild(btnContainer); msgDiv.appendChild(pElem);
    });

    if (suggestedCBT && cbtSuggestions[suggestedCBT]) {
      const suggestionsBox = document.createElement('div'); suggestionsBox.className = 'cbt-inline-buttons';
      cbtSuggestions[suggestedCBT].forEach(sug => { const btn = document.createElement('button'); btn.className = 'cbt-inline-btn'; btn.innerHTML = sug.label; btn.onclick = () => window.executeCBTSuggestion(sug.action, btn); suggestionsBox.appendChild(btn); });
      msgDiv.appendChild(suggestionsBox);
    }
  } else { msgDiv.innerText = text; }
  
  container.appendChild(msgDiv); container.scrollTop = container.scrollHeight;
  if (save) { state.session_history.push({ text, sender, time: new Date().toLocaleString('pt-BR') }); Storage.set('aquele_abraco_state', JSON.stringify(state)); }
}

function loadState() { const saved = Storage.get('aquele_abraco_state'); if (saved) { const parsed = JSON.parse(saved); if(parsed && Array.isArray(parsed.session_history)) { state = { ...state, ...parsed }; if(state.theme) setTheme(state.theme); if(state.zoom) setZoom(state.zoom); renderHistory(); return; } } renderHistory(); }
function renderHistory() { const container = document.getElementById('chat-container'); container.innerHTML = ''; appendMessage("Acesso verificado. O que a sua alma gostaria de dizer ou criar hoje?", 'assistant', false); state.session_history.forEach(msg => appendMessage(msg.text, msg.sender, false)); }
function sendEmoji(emoji) { toggleEmojiPicker(); appendMessage(emoji, 'user'); processUserMessageWithCascade(emoji).then(res => { let cleanText = res.text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim(); appendMessage(cleanText, 'assistant', true, res.suggestedCBT); }); }

// Registrar Service Worker do PWA Nativamente aqui no final do script
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('App Atualizado Modularmente');
          }
        });
      });
    });
  });
}
</script>
