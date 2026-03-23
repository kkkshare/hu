<template>
  <view class="page" :style="{ backgroundColor: currentEntry.background_color || '#f4efe5' }">
    <view class="bg-glow" />
    <view class="container">
      <view class="masthead">
        <text class="brand">HERVOICE DAILY</text>
        <text class="tagline">女性先锋语录日历 · 中英对照 · Teacher's Note</text>
      </view>

      <view class="topbar">
        <text class="date">{{ currentEntry.date }} · {{ weekText }} · {{ lunarText }}</text>
        <text class="theme">{{ currentEntry.theme }}</text>
      </view>

      <view class="daily-card" :class="{ calligraphy: currentEntry.visual_type === 'calligraphy' }">
        <text class="quote-cn">{{ currentEntry.quote.content_cn }}</text>
        <text class="quote-en">{{ currentEntry.quote.content_en }}</text>
        <text class="author">— {{ currentEntry.quote.author }} · {{ currentEntry.quote.source }}</text>

        <view class="note-block">
          <button class="note-toggle" @tap="toggleNote">
            <text>Teacher's Note</text>
            <text>{{ noteOpen ? '收起' : '展开' }}</text>
          </button>
          <view v-if="noteOpen" class="note-body">
            <text class="note-keyword">关键词：{{ currentEntry.teacher_note.keyword }}</text>
            <text class="note-text">{{ currentEntry.teacher_note.explanation }}</text>
          </view>
        </view>
      </view>

      <view class="actions">
        <button class="btn" @tap="prevDay">上一条</button>
        <button class="btn" @tap="nextDay">下一条</button>
        <button class="btn primary" @tap="generatePoster">生成日签（1080x1440）</button>
      </view>

      <view class="poster-template-wrap">
        <text class="section-title">海报模板</text>
        <view class="template-row">
          <button
            v-for="tpl in templates"
            :key="tpl.id"
            class="tpl-btn"
            :class="{ active: tpl.id === activeTemplateId }"
            @tap="activeTemplateId = tpl.id"
          >
            {{ tpl.name }}
          </button>
        </view>
      </view>

      <view class="history-wrap">
        <text class="section-title">历史回顾</text>
        <scroll-view scroll-x class="history-scroll">
          <view class="history-row">
            <button
              v-for="(item, idx) in entries"
              :key="item.date"
              class="day-chip"
              :class="{ active: idx === currentIndex }"
              @tap="selectDay(idx)"
            >
              {{ item.date.slice(5) }}
            </button>
          </view>
        </scroll-view>
      </view>

      <view v-if="posterUrl" class="poster-preview">
        <image :src="posterUrl" mode="widthFix" class="poster-image" />
        <button class="btn" @tap="savePoster">保存到相册</button>
      </view>
    </view>

    <canvas canvas-id="posterCanvas" class="poster-canvas" />
  </view>
</template>

<script>
import { fetchEntries } from '@/utils/dataService'
import { todayKey, weekLabel, findBestIndex } from '@/utils/date'
import { lunarLabel } from '@/utils/lunar'
import { posterTemplates } from '@/utils/posterTemplates'

const fallbackEntry = {
  date: '2026-02-18',
  theme: 'Fallback',
  quote: {
    content_cn: '今天也请温柔而坚定地向前走。',
    content_en: 'Walk forward with tenderness and resolve.',
    author: 'HerVoice',
    source: 'Daily'
  },
  teacher_note: {
    keyword: 'resolve',
    explanation: 'resolve 指坚定决心，常用于鼓励表达。'
  },
  visual_type: 'standard',
  background_color: '#f4efe5'
}

export default {
  data() {
    return {
      entries: [fallbackEntry],
      currentIndex: 0,
      noteOpen: false,
      templates: posterTemplates,
      activeTemplateId: posterTemplates[0].id,
      posterUrl: ''
    }
  },
  computed: {
    currentEntry() {
      return this.entries[this.currentIndex] || fallbackEntry
    },
    weekText() {
      return weekLabel(this.currentEntry.date)
    },
    lunarText() {
      return lunarLabel(this.currentEntry.date)
    },
    activeTemplate() {
      return this.templates.find((t) => t.id === this.activeTemplateId) || this.templates[0]
    }
  },
  async onLoad() {
    const list = await fetchEntries()
    this.entries = list.length ? list : [fallbackEntry]
    this.currentIndex = findBestIndex(this.entries, todayKey())
  },
  methods: {
    toggleNote() {
      this.noteOpen = !this.noteOpen
    },
    prevDay() {
      const len = this.entries.length
      this.currentIndex = (this.currentIndex - 1 + len) % len
      this.noteOpen = false
    },
    nextDay() {
      const len = this.entries.length
      this.currentIndex = (this.currentIndex + 1) % len
      this.noteOpen = false
    },
    selectDay(idx) {
      this.currentIndex = idx
      this.noteOpen = false
    },
    wrapText(raw, maxChars) {
      const text = raw || ''
      const lines = []
      let line = ''
      for (let i = 0; i < text.length; i += 1) {
        line += text[i]
        if (line.length >= maxChars) {
          lines.push(line)
          line = ''
        }
      }
      if (line) lines.push(line)
      return lines
    },
    async generatePoster() {
      const e = this.currentEntry
      const t = this.activeTemplate
      const ctx = uni.createCanvasContext('posterCanvas', this)

      ctx.setFillStyle(t.bg)
      ctx.fillRect(0, 0, 1080, 1440)

      if (e.visual_type === 'calligraphy') {
        ctx.setFillStyle('rgba(0,0,0,0.05)')
        ctx.fillRect(0, 0, 1080, 1440)
      }

      ctx.setFillStyle(t.titleColor)
      ctx.setFontSize(54)
      ctx.fillText('HerVoice Daily', 84, 120)

      ctx.setFillStyle(t.accent)
      ctx.setFontSize(30)
      ctx.fillText(`${e.date} · ${this.weekText} · ${this.lunarText}`, 84, 180)
      ctx.fillText(`Template: ${t.name}`, 84, 226)

      ctx.setFillStyle(t.quoteCnColor)
      ctx.setFontSize(58)
      let y = 330
      const cnLines = this.wrapText(e.quote.content_cn, 14)
      cnLines.forEach((line) => {
        ctx.fillText(line, 84, y)
        y += 88
      })

      ctx.setFillStyle(t.quoteEnColor)
      ctx.setFontSize(40)
      y += 44
      const enLines = this.wrapText(e.quote.content_en, 32)
      enLines.forEach((line) => {
        ctx.fillText(line, 84, y)
        y += 62
      })

      ctx.setFillStyle(t.accent)
      ctx.setFontSize(30)
      ctx.fillText(`— ${e.quote.author} · ${e.quote.source}`, 84, y + 70)
      ctx.fillText(`Teacher's Note: ${e.teacher_note.keyword}`, 84, y + 138)

      ctx.setFillStyle(t.quoteEnColor)
      ctx.setFontSize(28)
      const noteLines = this.wrapText(e.teacher_note.explanation, 30)
      let noteY = y + 190
      noteLines.forEach((line) => {
        ctx.fillText(line, 84, noteY)
        noteY += 44
      })

      ctx.setStrokeStyle(t.accent)
      ctx.strokeRect(840, 1160, 170, 170)
      ctx.setFillStyle(t.accent)
      ctx.setFontSize(24)
      ctx.fillText('SCAN', 888, 1256)

      ctx.draw(false, () => {
        uni.canvasToTempFilePath(
          {
            canvasId: 'posterCanvas',
            width: 1080,
            height: 1440,
            destWidth: 1080,
            destHeight: 1440,
            success: (res) => {
              this.posterUrl = res.tempFilePath
              uni.showToast({ title: '海报已生成', icon: 'success' })
            },
            fail: () => {
              uni.showToast({ title: '海报生成失败', icon: 'none' })
            }
          },
          this
        )
      })
    },
    savePoster() {
      if (!this.posterUrl) return
      uni.saveImageToPhotosAlbum({
        filePath: this.posterUrl,
        success: () => uni.showToast({ title: '已保存到相册', icon: 'success' }),
        fail: () => uni.showToast({ title: '保存失败，请授权相册', icon: 'none' })
      })
    }
  }
}
</script>

<style scoped>
.page {
  position: relative;
  min-height: 100vh;
  padding: 28rpx 22rpx 44rpx;
}

.bg-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 10% 8%, rgba(178, 138, 118, 0.22), transparent 32%),
    radial-gradient(circle at 90% 100%, rgba(159, 125, 71, 0.14), transparent 42%);
}

.container {
  max-width: 700rpx;
  margin: 0 auto;
  position: relative;
  z-index: 1;
}

.masthead {
  margin-bottom: 20rpx;
}

.brand {
  display: block;
  font-size: 48rpx;
  letter-spacing: 0.12em;
  color: #2d261a;
  font-family: 'Didot', 'Bodoni 72', 'Times New Roman', serif;
}

.tagline {
  display: block;
  margin-top: 8rpx;
  padding-left: 14rpx;
  border-left: 4rpx solid rgba(159, 125, 71, 0.52);
  color: #675f52;
  font-size: 23rpx;
  line-height: 1.7;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18rpx;
  font-size: 23rpx;
  color: #605749;
}

.theme {
  border: 1px solid rgba(159, 125, 71, 0.38);
  border-radius: 999px;
  background: rgba(255, 251, 244, 0.56);
  color: #6a4e24;
  padding: 5rpx 20rpx;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.daily-card {
  background:
    linear-gradient(120deg, rgba(255, 255, 255, 0.24), transparent 56%),
    repeating-linear-gradient(
      0deg,
      rgba(46, 38, 29, 0.035),
      rgba(46, 38, 29, 0.035) 1rpx,
      transparent 1rpx,
      transparent 4rpx
    ),
    rgba(255, 252, 247, 0.86);
  border: 1px solid rgba(60, 48, 33, 0.16);
  border-radius: 34rpx;
  padding: 34rpx 30rpx;
  box-shadow: 0 16rpx 42rpx rgba(20, 16, 8, 0.12);
}

.daily-card.calligraphy {
  background:
    linear-gradient(140deg, rgba(239, 231, 216, 0.9), rgba(247, 242, 234, 0.86)),
    repeating-linear-gradient(
      0deg,
      rgba(46, 38, 29, 0.035),
      rgba(46, 38, 29, 0.035) 1rpx,
      transparent 1rpx,
      transparent 4rpx
    );
}

.quote-cn {
  display: block;
  font-size: 58rpx;
  line-height: 1.64;
  color: #251f15;
  letter-spacing: 0.04em;
}

.quote-en {
  display: block;
  margin-top: 24rpx;
  font-size: 33rpx;
  line-height: 1.85;
  color: #3d3427;
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  letter-spacing: 0.01em;
}

.author {
  display: block;
  margin-top: 20rpx;
  text-align: right;
  font-size: 23rpx;
  color: #665c4d;
  letter-spacing: 0.03em;
}

.note-block {
  margin-top: 22rpx;
  border-top: 1px dashed rgba(74, 63, 49, 0.28);
  padding-top: 20rpx;
}

.note-toggle {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: #4f4535;
  font-size: 27rpx;
  line-height: 1.5;
}

.note-body {
  margin-top: 16rpx;
  background: rgba(255, 250, 243, 0.62);
  border-radius: 18rpx;
  padding: 14rpx 16rpx;
}

.note-keyword,
.note-text {
  display: block;
  font-size: 26rpx;
  line-height: 1.75;
  color: #474031;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.btn {
  min-height: 78rpx;
  border-radius: 18rpx;
  background: rgba(251, 246, 238, 0.86);
  border: 1px solid rgba(62, 50, 35, 0.18);
  color: #3d362a;
  font-size: 25rpx;
  letter-spacing: 0.03em;
  flex: 1 1 calc(50% - 12rpx);
}

.btn.primary {
  background: linear-gradient(135deg, #2d2518, #4a3a27);
  border-color: #5a472d;
  color: #faf2e5;
  box-shadow: 0 10rpx 20rpx rgba(43, 32, 17, 0.2);
  flex-basis: 100%;
}

.poster-template-wrap,
.history-wrap,
.poster-preview {
  margin-top: 22rpx;
}

.section-title {
  display: block;
  margin-bottom: 12rpx;
  font-size: 23rpx;
  color: #5d5445;
  letter-spacing: 0.06em;
}

.template-row,
.history-row {
  display: flex;
  gap: 10rpx;
}

.tpl-btn,
.day-chip {
  background: rgba(248, 243, 234, 0.86);
  border: 1px solid rgba(57, 49, 38, 0.18);
  border-radius: 999px;
  min-height: 60rpx;
  padding: 0 22rpx;
  font-size: 22rpx;
  color: #4a4235;
}

.tpl-btn.active,
.day-chip.active {
  border-color: #8f6b36;
  color: #6d4f22;
  background: linear-gradient(145deg, #f4ead7, #efe1c7);
}

.poster-preview {
  background: rgba(255, 252, 247, 0.92);
  border: 1px solid rgba(57, 47, 34, 0.17);
  border-radius: 24rpx;
  padding: 18rpx;
  box-shadow: 0 14rpx 30rpx rgba(36, 28, 16, 0.12);
}

.poster-image {
  width: 100%;
  border-radius: 16rpx;
}

.poster-canvas {
  position: fixed;
  left: -9999px;
  top: -9999px;
  width: 1080px;
  height: 1440px;
}

.btn::after,
.tpl-btn::after,
.day-chip::after,
.note-toggle::after {
  border: none;
}
</style>
