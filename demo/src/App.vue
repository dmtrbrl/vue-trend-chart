<script setup lang="ts">
import { computed, ref } from "vue";
import { TrendChart, type TrendChartMouseMoveEvent } from "vue-trend-chart";
import ChartPlayground from "./components/chart-playground.vue";
import ShowcaseExamples from "./components/showcase-examples.vue";
import CodeBlock from "./components/code-block.vue";
import { quickstartCode } from "./snippets";
import "./styles.css";

const heroValues = [
  32, 38, 35, 50, 43, 46, 41, 58, 52, 64, 57, 69, 66, 78, 71, 88, 81, 94,
];
const heroActive = ref<TrendChartMouseMoveEvent | null>(null);
const heroValue = computed(() =>
  heroActive.value
    ? (Number(heroActive.value.data[0]) * 513).toLocaleString("en-US")
    : "48,222",
);
const apiGroups = [
  {
    title: "Data & curves",
    entries: [
      ["datasets", "Required. An array of datasets with data values."],
      ["smooth", "Round the line between points."],
      ["fill / stroke", "Show an area, a line, or both."],
      ["showPoints", "Display each observation as an SVG circle."],
      ["className", "Give each dataset its own CSS style."],
    ],
  },
  {
    title: "Axes & layout",
    entries: [
      ["labels.xLabels", "Position labels at their corresponding data slots."],
      ["labels.yLabels", "Choose the number of evenly spaced Y labels."],
      [
        "yLabelsTextFormatter",
        "Format values as currency, percentages, or your own units.",
      ],
      ["min / max", "Extend the automatic range without hiding data."],
      ["padding", "A number or CSS-like shorthand, in pixels."],
    ],
  },
  {
    title: "Grid & interaction",
    entries: [
      [
        "grid.horizontalLines",
        "Show horizontal gridlines; set horizontalLinesNumber for a custom count.",
      ],
      [
        "grid.verticalLines",
        "Show vertical gridlines; set verticalLinesNumber for a custom count.",
      ],
      [
        "interactive",
        "Enable nearest-point tracking for mouse, pen, and touch.",
      ],
      [
        "@mouse-move",
        "Receive { index, data }, or null when the interaction ends.",
      ],
      ["aria-label", "Pass a text alternative through to the SVG image."],
    ],
  },
];
</script>

<template>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="#" aria-label="Vue Trend Chart home"
        ><svg viewBox="-8 -20 177 160" aria-hidden="true">
          <defs>
            <!-- Split one 36-unit stroke at its centerline into two equal 18-unit bands. -->
            <clipPath id="brand-upper-band">
              <path
                d="M.5 35h20c34 0 42 80 60 80 22 0 18-110 60-110h20V-20H.5Z"
                fill="#fff"
              />
            </clipPath>
          </defs>
          <g fill="none" stroke-width="36">
            <path
              d="M.5 35h20c34 0 42 80 60 80 22 0 18-110 60-110h20"
              stroke="#39AF77"
            />
            <path
              d="M.5 35h20c34 0 42 80 60 80 22 0 18-110 60-110h20"
              stroke="#2F4053"
              clip-path="url(#brand-upper-band)"
            />
          </g></svg
        ><span>vue trend chart</span></a
      >
      <nav aria-label="Main navigation">
        <a href="#playground">Playground</a><a href="#examples">Examples</a
        ><a href="#get-started">Get started</a>
      </nav>
      <a
        class="github-link"
        href="https://github.com/dmtrbrl/vue-trend-chart"
        target="_blank"
        rel="noopener noreferrer"
        >GitHub <span aria-hidden="true">↗</span></a
      >
    </div>
  </header>

  <main id="main" class="page-content">
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero-intro">
        <div>
          <h1 id="hero-title">
            Trend charts.<br /><span class="hero-accent">Built for Vue.</span>
          </h1>
        </div>
        <div class="hero-description">
          <p>
            Responsive SVG trend charts for Vue 3. Customize, preview, and copy
            the code.
          </p>
          <div class="hero-links">
            <a class="primary-button" href="#playground"
              >Try the playground <span aria-hidden="true">↗</span></a
            ><a class="text-link" href="#get-started"
              >Get started <span aria-hidden="true">→</span></a
            >
          </div>
        </div>
      </div>

      <div class="hero-showcase">
        <div class="hero-chart-info">
          <div>
            <p class="chart-overline">PAGE VIEWS</p>
            <div class="hero-stat">
              {{ heroValue }}<span class="growth-badge">↗ 28.6%</span>
            </div>
            <p class="hero-stat-description">
              Sample page views <span>·</span>
              {{ heroActive ? `Day ${heroActive.index + 1}` : "This month" }}
            </p>
          </div>
          <div class="hero-chart-note">
            <span class="chart-note-line"></span
            ><span><strong>Hover to inspect</strong></span>
          </div>
        </div>
        <svg class="svg-definitions" aria-hidden="true" width="0" height="0">
          <defs>
            <linearGradient
              id="hero-fill"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="0"
              y2="230"
            >
              <stop offset="0%" stop-color="#65bb89" stop-opacity="0.28" />
              <stop offset="100%" stop-color="#65bb89" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div class="hero-chart">
          <TrendChart
            class="styled-chart hero-trend"
            aria-label="Illustrative monthly page views trending upward"
            :datasets="[
              {
                data: heroValues,
                smooth: true,
                fill: true,
                className: 'series-primary',
              },
            ]"
            :grid="{ horizontalLines: true, horizontalLinesNumber: 4 }"
            :min="0"
            :max="100"
            :padding="8"
            interactive
            @mouse-move="heroActive = $event"
          />
        </div>
        <div class="hero-chart-axis">
          <span>01 JUN</span><span>06 JUN</span><span>12 JUN</span
          ><span>18 JUN</span>
        </div>
        <div class="hero-chart-footer">
          <span
            ><span class="status-dot"></span> Rendered with Vue Trend
            Chart</span
          ><span>Sample data</span>
        </div>
      </div>

      <div class="feature-strip">
        <div>
          <span class="feature-symbol">V</span
          ><span>Made for <strong>Vue 3</strong></span>
        </div>
        <div>
          <span class="feature-symbol mono">TS</span
          ><span><strong>TypeScript</strong> included</span>
        </div>
        <div>
          <span class="feature-symbol">◇</span
          ><span>Native <strong>SVG</strong> rendering</span>
        </div>
        <div>
          <span class="feature-symbol">↔</span
          ><span><strong>Responsive</strong> by default</span>
        </div>
        <div>
          <span class="feature-symbol">{ }</span
          ><span>Style with <strong>CSS</strong></span>
        </div>
      </div>
    </section>

    <ChartPlayground />
    <ShowcaseExamples />

    <section
      id="get-started"
      class="section getting-started"
      aria-labelledby="start-title"
    >
      <div class="start-copy">
        <h2 id="start-title">Get started</h2>
        <p>Requires Vue 3.3+.</p>
        <CodeBlock code="npm install vue-trend-chart" filename="Terminal" />
        <ol class="start-steps">
          <li>
            <span>01</span>
            <div>
              <strong>Import the component</strong>
              <p>Use a named import or <code>app.use(VueTrendChart)</code>.</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <strong>Set a height</strong>
              <p>Width adjusts to the container.</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <strong>Label and style</strong>
              <p>Add an <code>aria-label</code>. Style the SVG with CSS.</p>
            </div>
          </li>
        </ol>
        <a
          class="text-link"
          href="https://github.com/dmtrbrl/vue-trend-chart#readme"
          target="_blank"
          rel="noopener noreferrer"
          >Documentation <span aria-hidden="true">↗</span></a
        >
        <p class="compatibility-note">
          Vue 3.3+ · ESM & CommonJS · Server rendering supported
        </p>
      </div>
      <CodeBlock :code="quickstartCode" filename="YourFirstChart.vue" />
    </section>

    <section id="api" class="section api-section" aria-labelledby="api-title">
      <div class="section-heading">
        <div>
          <h2 id="api-title">API</h2>
        </div>
        <a
          class="text-link"
          href="https://github.com/dmtrbrl/vue-trend-chart#readme"
          target="_blank"
          rel="noopener noreferrer"
          >Full API docs <span aria-hidden="true">↗</span></a
        >
      </div>
      <div class="api-groups">
        <details
          v-for="group in apiGroups"
          :key="group.title"
          class="api-group"
        >
          <summary>{{ group.title }}<span aria-hidden="true">＋</span></summary>
          <dl>
            <template v-for="[name, description] in group.entries" :key="name"
              ><dt>
                <code>{{ name }}</code>
              </dt>
              <dd>{{ description }}</dd></template
            >
          </dl>
        </details>
      </div>
      <p class="accessibility-note">
        For essential data, provide a text summary or table alongside the chart.
      </p>
    </section>
  </main>

  <footer class="site-footer">
    <div class="footer-inner">
      <a class="footer-brand" href="#">vue trend chart</a>
      <div>
        <a
          href="https://github.com/dmtrbrl/vue-trend-chart/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
          >MIT license</a
        ><a
          href="https://github.com/dmtrbrl/vue-trend-chart"
          target="_blank"
          rel="noopener noreferrer"
          >Contribute <span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
  </footer>
</template>
