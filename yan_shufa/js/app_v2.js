/**
 * 颜体书法练习 v2.0 - 核心逻辑 (SVG 矢量版)
 * 1. 放弃所有图片资源，使用 SVG 绘制米字格。
 * 2. 使用 WebFont 实现汉字显示。
 * 3. 锁死 ViewBox 确保任何屏幕下比例一致。
 */

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyMissingBtn = document.getElementById('copyMissingBtn');
    const autoGenMissingBtn = document.getElementById('autoGenMissingBtn');
    const importGlyphBtn = document.getElementById('importGlyphBtn');
    const clearGlyphBtn = document.getElementById('clearGlyphBtn');
    const glyphFileInput = document.getElementById('glyphFileInput');
    const aiBaseUrlInput = document.getElementById('aiBaseUrl');
    const aiModelInput = document.getElementById('aiModel');
    const aiApiKeyInput = document.getElementById('aiApiKey');
    const fontPreset = document.getElementById('fontPreset');
    const resultMeta = document.getElementById('resultMeta');
    const fontStatus = document.getElementById('fontStatus');
    const missingPanel = document.getElementById('missingPanel');
    const missingMeta = document.getElementById('missingMeta');
    const resultContainer = document.getElementById('resultContainer');
    const fullscreenOverlay = document.getElementById('fullscreenOverlay');
    const fullscreenContent = document.getElementById('fullscreenContent');
    const fullscreenCharTitle = document.getElementById('fullscreenChar');
    const fullscreenIndex = document.getElementById('fullscreenIndex');
    const closeFullscreen = document.getElementById('closeFullscreen');
    const prevCharBtn = document.getElementById('prevChar');
    const nextCharBtn = document.getElementById('nextChar');

    let currentChars = [];
    let currentEntries = [];
    let currentIndex = -1;
    let activeFontReady = false;
    let selectedFontId = 'XinDiZhaoMengFu';
    const glyphCache = new Map();
    const AI_GLYPH_CACHE_KEY = 'zhaoti_ai_glyph_cache_v1';
    const AI_CONFIG_KEY = 'zhaoti_ai_config_v1';
    let aiGlyphCache = loadAiGlyphCache();
    let aiConfig = loadAiConfig();
    const FONT_PRESETS = {
        XinDiZhaoMengFu: { label: '新蒂赵孟頫（覆盖优先）', family: "'XinDiZhaoMengFu', serif", probe: '趙體練習' },
        ZhaoMengFuKai: { label: '赵孟頫楷书', family: "'ZhaoMengFuKai', serif", probe: '趙孟頫' },
        HYXingKaiFan: { label: '汉仪行楷繁', family: "'HYXingKaiFan', serif", probe: '練字臨摹' },
        TXTieShanKaiFan: { label: '腾祥铁山楷书繁', family: "'TXTieShanKaiFan', serif", probe: '書法練習' },
        FZGuanJunKaiFan: { label: '方正管峻楷书繁体', family: "'FZGuanJunKaiFan', serif", probe: '繁體字庫' },
        LiShouShuHaoZiJF: { label: '励手书昊仔简繁', family: "'LiShouShuHaoZiJF', serif", probe: '簡繁共用' }
    };
    const toTraditional = createTraditionalConverter();
    hydrateAiConfigInputs();
    ensureActiveFont();

    // 搜索逻辑
    const performSearch = () => {
        const text = searchInput.value.trim();
        if (!text) {
            showEmptyState();
            return;
        }

        const tradText = toTraditional(text);
        currentChars = [...tradText].filter((char) => isHanChar(char));
        if (!currentChars.length) {
            showEmptyState();
            return;
        }

        currentEntries = currentChars.map((char) => {
            const aiPath = aiGlyphCache[char];
            const missing = !isGlyphAvailable(char);
            if (aiPath) {
                return {
                    char,
                    missing: false,
                    source: 'ai',
                    aiPath,
                    fontFamily: FONT_PRESETS[selectedFontId].family
                };
            }
            return {
                char,
                missing,
                source: missing ? 'fallback' : 'font',
                fontFamily: missing ? "'Noto Serif SC', 'Songti SC', serif" : FONT_PRESETS[selectedFontId].family
            };
        });

        resultContainer.innerHTML = ''; // 清空

        currentEntries.forEach((entry, index) => {
            const card = createCharCard(entry, index);
            resultContainer.appendChild(card);
        });

        const missingChars = currentEntries.filter((x) => x.missing).map((x) => x.char);
        const aiCount = currentEntries.filter((x) => x.source === 'ai').length;
        if (tradText !== text) {
            resultMeta.textContent = `繁体：${tradText}（${currentChars.length} 字）`;
        } else {
            resultMeta.textContent = `已载入 ${currentChars.length} 字`;
        }
        if (aiCount) {
            resultMeta.textContent += ` · AI补字命中 ${aiCount} 字`;
        }
        if (missingChars.length) {
            missingPanel.style.display = 'block';
            missingMeta.textContent = `主字帖缺字 ${missingChars.length} 个：${[...new Set(missingChars)].join(' ')}`;
            resultMeta.textContent += ` · 缺字 ${missingChars.length}`;
        } else {
            missingPanel.style.display = 'none';
            missingMeta.textContent = '';
        }
    };

    searchBtn.addEventListener('click', performSearch);
    fontPreset.addEventListener('change', async () => {
        selectedFontId = fontPreset.value;
        glyphCache.clear();
        await ensureActiveFont();
        if (searchInput.value.trim()) performSearch();
    });
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        currentChars = [];
        currentEntries = [];
        currentIndex = -1;
        showEmptyState();
    });
    copyMissingBtn.addEventListener('click', async () => {
        const missingChars = [...new Set(currentEntries.filter((x) => x.missing).map((x) => x.char))];
        if (!missingChars.length) return;
        const text = missingChars.join('');
        try {
            await navigator.clipboard.writeText(text);
            missingMeta.textContent = `已复制缺字：${missingChars.join(' ')}`;
        } catch (_) {
            missingMeta.textContent = `缺字：${missingChars.join(' ')}`;
        }
    });
    autoGenMissingBtn.addEventListener('click', async () => {
        const missingChars = [...new Set(currentEntries.filter((x) => x.missing).map((x) => x.char))];
        if (!missingChars.length) {
            missingMeta.textContent = '当前没有缺字，无需自动补字。';
            return;
        }
        aiConfig = readAiConfigFromInputs();
        saveAiConfig(aiConfig);
        if (!aiConfig.baseUrl || !aiConfig.model || !aiConfig.apiKey) {
            missingMeta.textContent = '请先在“AI补字配置”里填写 Base URL / 模型 / API Key。';
            return;
        }
        autoGenMissingBtn.disabled = true;
        missingMeta.textContent = `正在自动补字：0 / ${missingChars.length}`;
        let success = 0;
        for (let i = 0; i < missingChars.length; i += 1) {
            const ch = missingChars[i];
            try {
                const path = await generateGlyphPathByAI(ch, aiConfig);
                if (path) {
                    aiGlyphCache[ch] = path;
                    success += 1;
                }
            } catch (_) {
                // skip failed chars
            }
            missingMeta.textContent = `正在自动补字：${i + 1} / ${missingChars.length}（成功 ${success}）`;
        }
        saveAiGlyphCache(aiGlyphCache);
        autoGenMissingBtn.disabled = false;
        missingMeta.textContent = `自动补字完成：成功 ${success} / ${missingChars.length}`;
        glyphCache.clear();
        if (searchInput.value.trim()) performSearch();
    });
    importGlyphBtn.addEventListener('click', () => glyphFileInput.click());
    glyphFileInput.addEventListener('change', async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        try {
            const text = await file.text();
            const parsed = JSON.parse(text);
            const merged = normalizeGlyphCache(parsed);
            aiGlyphCache = { ...aiGlyphCache, ...merged };
            saveAiGlyphCache(aiGlyphCache);
            glyphCache.clear();
            missingMeta.textContent = `已导入 AI 补字 ${Object.keys(merged).length} 个。`;
            if (searchInput.value.trim()) performSearch();
        } catch (_) {
            missingMeta.textContent = '导入失败：请使用 JSON 格式（{"字":"SVG_PATH"}）。';
        } finally {
            glyphFileInput.value = '';
        }
    });
    clearGlyphBtn.addEventListener('click', () => {
        aiGlyphCache = {};
        saveAiGlyphCache(aiGlyphCache);
        glyphCache.clear();
        missingMeta.textContent = '已清空 AI 补字缓存。';
        if (searchInput.value.trim()) performSearch();
    });
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    /**
     * 创建汉字卡片 (基于 SVG)
     */
    function createCharCard(entry, index) {
        const card = document.createElement('div');
        card.className = 'char-card scroll-unfurl';
        card.style.animationDelay = `${Math.min(index * 60, 360)}ms`;
        
        const svgWrapper = document.createElement('div');
        svgWrapper.className = 'svg-container';
        svgWrapper.innerHTML = generateMiZiGeSVG(entry.char, false, entry.fontFamily, entry.aiPath);
        
        card.appendChild(svgWrapper);
        if (entry.source === 'ai') {
            const aiBadge = document.createElement('div');
            aiBadge.className = 'mt-2 text-center';
            aiBadge.innerHTML = '<span class="warn-badge">AI补字</span>';
            card.appendChild(aiBadge);
        } else if (entry.missing) {
            const warn = document.createElement('div');
            warn.className = 'mt-2 text-center';
            warn.innerHTML = '<span class="warn-badge">缺字-后备字形</span>';
            card.appendChild(warn);
        }
        
        // 点击进入全屏
        card.onclick = () => openFullscreenByIndex(index);
        
        return card;
    }

    /**
     * 生成米字格 SVG
     * @param {string} char 汉字
     * @param {boolean} isFull 是否为全屏模式
     */
    function generateMiZiGeSVG(char, isFull = false, fontFamily = "'ZhaoMengFuKai', serif", aiPath = '') {
        const size = 1000;
        const center = size / 2;
        const color = 'var(--mi-color)';
        const charColor = 'var(--char-color)';
        const fontSize = isFull ? 760 : 700;
        const outlineWidth = isFull ? 7 : 6;
        
        return `
            <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
                <defs>
                    <filter id="inkBlur" x="-10%" y="-10%" width="120%" height="120%">
                        <feGaussianBlur stdDeviation="${isFull ? 1.2 : 1}" />
                    </filter>
                </defs>
                <rect x="10" y="10" width="${size-20}" height="${size-20}" fill="rgba(255,248,236,0.72)" />
                <!-- 边框 -->
                <rect x="10" y="10" width="${size-20}" height="${size-20}" fill="none" stroke="${color}" stroke-width="8" />
                <!-- 米字线条 -->
                <line x1="10" y1="10" x2="${size-10}" y2="${size-10}" stroke="${color}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="${size-10}" y1="10" x2="10" y2="${size-10}" stroke="${color}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="${center}" y1="10" x2="${center}" y2="${size-10}" stroke="${color}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10,10" />
                <line x1="10" y1="${center}" x2="${size-10}" y2="${center}" stroke="${color}" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="10,10" />
                
                ${aiPath ? `
                <path d="${aiPath}"
                    fill="${charColor}"
                    fill-opacity="0.92"
                    transform="translate(130,130) scale(0.74)"
                    stroke="${charColor}"
                    stroke-width="${isFull ? 5 : 4}"
                    stroke-linejoin="round"
                    stroke-linecap="round" />
                ` : `
                <text x="${center}" y="${center}" 
                    text-anchor="middle" 
                    dominant-baseline="central"
                    fill="${charColor}" 
                    fill-opacity="0.25"
                    filter="url(#inkBlur)"
                    style="font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: normal;">
                    ${char}
                </text>
                <text x="${center}" y="${center}" 
                    text-anchor="middle" 
                    dominant-baseline="central"
                    fill="${charColor}"
                    stroke="${charColor}"
                    stroke-width="${outlineWidth}"
                    stroke-linejoin="round"
                    paint-order="stroke fill"
                    style="font-family: ${fontFamily}; font-size: ${fontSize}px; font-weight: normal;">
                    ${char}
                </text>
                `}
            </svg>
        `;
    }

    /**
     * 全屏临摹模式
     */
    function openFullscreenByIndex(index) {
        if (!currentChars.length) return;
        currentIndex = index;
        const entry = currentEntries[currentIndex];
        fullscreenContent.innerHTML = generateMiZiGeSVG(entry.char, true, entry.fontFamily, entry.aiPath);
        fullscreenCharTitle.innerText = `赵体临摹：${entry.char}`;
        if (entry.source === 'ai') {
            fullscreenIndex.innerText = `${currentIndex + 1} / ${currentChars.length} · AI补字`;
        } else if (entry.missing) {
            fullscreenIndex.innerText = `${currentIndex + 1} / ${currentChars.length} · 缺字后备`;
        } else {
            fullscreenIndex.innerText = `${currentIndex + 1} / ${currentChars.length}`;
        }
        prevCharBtn.disabled = currentIndex <= 0;
        nextCharBtn.disabled = currentIndex >= currentChars.length - 1;
        prevCharBtn.classList.toggle('opacity-30', prevCharBtn.disabled);
        nextCharBtn.classList.toggle('opacity-30', nextCharBtn.disabled);
        fullscreenOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 禁止背景滚动
    }

    function closeFullscreenMode() {
        fullscreenOverlay.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showEmptyState() {
        resultContainer.innerHTML = `
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-amber-900/30">
                <div class="text-8xl mb-4 opacity-20 calligraphy-font">颜</div>
                <p class="text-lg">请输入汉字开启古风临摹</p>
            </div>
        `;
        resultMeta.textContent = '';
        missingPanel.style.display = 'none';
        missingMeta.textContent = '';
    }

    function isHanChar(char) {
        return /[\u3400-\u9FFF\uF900-\uFAFF]/.test(char);
    }

    function normalizeGlyphCache(raw) {
        const out = {};
        if (!raw || typeof raw !== 'object') return out;
        for (const [k, v] of Object.entries(raw)) {
            if (k.length !== 1) continue;
            if (typeof v === 'string' && v.trim()) out[k] = v.trim();
        }
        return out;
    }

    function loadAiGlyphCache() {
        try {
            const text = localStorage.getItem(AI_GLYPH_CACHE_KEY);
            if (!text) return {};
            return normalizeGlyphCache(JSON.parse(text));
        } catch (_) {
            return {};
        }
    }

    function saveAiGlyphCache(cache) {
        localStorage.setItem(AI_GLYPH_CACHE_KEY, JSON.stringify(cache));
    }

    function loadAiConfig() {
        try {
            const text = localStorage.getItem(AI_CONFIG_KEY);
            if (!text) return { baseUrl: '', model: '', apiKey: '' };
            const obj = JSON.parse(text);
            return {
                baseUrl: typeof obj.baseUrl === 'string' ? obj.baseUrl : '',
                model: typeof obj.model === 'string' ? obj.model : '',
                apiKey: typeof obj.apiKey === 'string' ? obj.apiKey : ''
            };
        } catch (_) {
            return { baseUrl: '', model: '', apiKey: '' };
        }
    }

    function saveAiConfig(cfg) {
        localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(cfg));
    }

    function hydrateAiConfigInputs() {
        aiBaseUrlInput.value = aiConfig.baseUrl || '';
        aiModelInput.value = aiConfig.model || '';
        aiApiKeyInput.value = aiConfig.apiKey || '';
    }

    function readAiConfigFromInputs() {
        return {
            baseUrl: aiBaseUrlInput.value.trim().replace(/\/+$/, ''),
            model: aiModelInput.value.trim(),
            apiKey: aiApiKeyInput.value.trim()
        };
    }

    async function generateGlyphPathByAI(char, cfg) {
        const endpoint = `${cfg.baseUrl}/chat/completions`;
        const prompt = `你是书法字形生成器。请为汉字“${char}”输出一个单一 SVG path 的 d 字符串，要求在 1000x1000 画布内，风格接近赵体楷书。只返回 d 字符串本身，不要任何解释。`;
        const body = {
            model: cfg.model,
            temperature: 0.2,
            messages: [
                { role: 'system', content: 'Only output ONE SVG path d string. No markdown, no explanation.' },
                { role: 'user', content: prompt }
            ]
        };
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${cfg.apiKey}`
            },
            body: JSON.stringify(body)
        });
        if (!resp.ok) throw new Error('api error');
        const data = await resp.json();
        const text = data?.choices?.[0]?.message?.content?.trim() || '';
        const d = sanitizePath(text);
        if (!d) throw new Error('invalid path');
        return d;
    }

    function sanitizePath(text) {
        if (!text) return '';
        let d = text;
        d = d.replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, ''));
        d = d.replace(/^[\s"'`]+|[\s"'`]+$/g, '');
        const match = d.match(/[Mm][^<>{}\n\r]*/);
        const raw = match ? match[0] : d;
        if (!/[Mm].*[Zz]/.test(raw)) return '';
        if (raw.length < 20) return '';
        return raw;
    }

    function createTraditionalConverter() {
        if (window.OpenCC && typeof window.OpenCC.Converter === 'function') {
            const converter = window.OpenCC.Converter({ from: 'cn', to: 'tw' });
            return (input) => converter(input);
        }
        return (input) => input;
    }

    function isGlyphAvailable(char) {
        if (!activeFontReady) return true;
        const cacheKey = `${selectedFontId}:${char}`;
        if (glyphCache.has(cacheKey)) return glyphCache.get(cacheKey);
        const size = 88;
        const c = document.createElement('canvas');
        c.width = size;
        c.height = size;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        if (!ctx) return true;

        const drawAndHash = (font) => {
            ctx.clearRect(0, 0, size, size);
            ctx.fillStyle = '#000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = font;
            ctx.fillText(char, size / 2, size / 2);
            const data = ctx.getImageData(0, 0, size, size).data;
            let hash = 0;
            for (let i = 3; i < data.length; i += 4) hash = (hash + data[i]) % 1000000007;
            return hash;
        };

        const base = drawAndHash('70px serif');
        const target = drawAndHash(`70px ${FONT_PRESETS[selectedFontId].family}`);
        const ok = target !== base;
        glyphCache.set(cacheKey, ok);
        return ok;
    }

    async function ensureActiveFont() {
        try {
            const preset = FONT_PRESETS[selectedFontId];
            await Promise.race([
                document.fonts.load(`32px ${preset.family}`, preset.probe),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4500))
            ]);
            const loaded = document.fonts.check(`32px ${preset.family}`, preset.probe[0] || '字');
            if (loaded) {
                activeFontReady = true;
                fontStatus.textContent = `当前字帖字体：${preset.label}（已加载）`;
                if (currentChars.length) performSearch();
            } else {
                activeFontReady = false;
                fontStatus.textContent = '字体未确认加载，当前可能显示回退字形。';
            }
        } catch (_) {
            activeFontReady = false;
            fontStatus.textContent = '字帖字体加载失败，请检查字体文件路径。';
        }
    }

    closeFullscreen.onclick = closeFullscreenMode;
    prevCharBtn.onclick = () => {
        if (currentIndex > 0) openFullscreenByIndex(currentIndex - 1);
    };
    nextCharBtn.onclick = () => {
        if (currentIndex < currentChars.length - 1) openFullscreenByIndex(currentIndex + 1);
    };

    document.addEventListener('keydown', (event) => {
        if (fullscreenOverlay.style.display !== 'flex') return;
        if (event.key === 'Escape') closeFullscreenMode();
        if (event.key === 'ArrowLeft' && currentIndex > 0) openFullscreenByIndex(currentIndex - 1);
        if (event.key === 'ArrowRight' && currentIndex < currentChars.length - 1) openFullscreenByIndex(currentIndex + 1);
    });
});
