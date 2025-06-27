export default {
  "_DOggr6EX.js": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DOggr6EX.js",
    "name": "asyncData",
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ],
    "dynamicImports": [
      "node_modules/@nuxt/content/dist/runtime/internal/database.client.js"
    ]
  },
  "_NzQZ86FH.js": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "NzQZ86FH.js",
    "name": "state",
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "layouts/admin.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "CYrTLWvn.js",
    "name": "admin",
    "src": "layouts/admin.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "middleware/admin.ts": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DrIL-LTd.js",
    "name": "admin",
    "src": "middleware/admin.ts",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_NzQZ86FH.js"
    ]
  },
  "middleware/superadmin.ts": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "LaTs4ey8.js",
    "name": "superadmin",
    "src": "middleware/superadmin.ts",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_NzQZ86FH.js"
    ]
  },
  "node_modules/@nuxt/content/dist/runtime/internal/database.client.js": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Bss5FUTx.js",
    "name": "database.client",
    "src": "node_modules/@nuxt/content/dist/runtime/internal/database.client.js",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_DOggr6EX.js"
    ],
    "dynamicImports": [
      "node_modules/@sqlite.org/sqlite-wasm/index.mjs"
    ]
  },
  "node_modules/@sqlite.org/sqlite-wasm/index.mjs": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "BxsNK8O4.js",
    "name": "index",
    "src": "node_modules/@sqlite.org/sqlite-wasm/index.mjs",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ],
    "assets": [
      "sqlite3.Ubkxdgq9.wasm"
    ]
  },
  "sqlite3.Ubkxdgq9.wasm": {
    "file": "sqlite3.Ubkxdgq9.wasm",
    "prefetch": true
  },
  "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm": {
    "prefetch": true,
    "file": "sqlite3.Ubkxdgq9.wasm",
    "src": "node_modules/@sqlite.org/sqlite-wasm/sqlite-wasm/jswasm/sqlite3.wasm"
  },
  "node_modules/nuxt/dist/app/components/error-404.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Bf3P-7dz.js",
    "name": "error-404",
    "src": "node_modules/nuxt/dist/app/components/error-404.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ],
    "css": []
  },
  "error-404.4oxyXxx0.css": {
    "file": "error-404.4oxyXxx0.css",
    "resourceType": "style",
    "prefetch": true,
    "preload": true
  },
  "node_modules/nuxt/dist/app/components/error-500.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DFfnIrjI.js",
    "name": "error-500",
    "src": "node_modules/nuxt/dist/app/components/error-500.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ],
    "css": []
  },
  "error-500.CZqNkBuR.css": {
    "file": "error-500.CZqNkBuR.css",
    "resourceType": "style",
    "prefetch": true,
    "preload": true
  },
  "node_modules/nuxt/dist/app/entry.js": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Bu-VSCu1.js",
    "name": "entry",
    "src": "node_modules/nuxt/dist/app/entry.js",
    "isEntry": true,
    "dynamicImports": [
      "middleware/admin.ts",
      "middleware/superadmin.ts",
      "layouts/admin.vue",
      "node_modules/nuxt/dist/app/components/error-404.vue",
      "node_modules/nuxt/dist/app/components/error-500.vue"
    ],
    "css": [
      "entry.dKMLwUZx.css"
    ],
    "_globalCSS": true
  },
  "entry.dKMLwUZx.css": {
    "file": "entry.dKMLwUZx.css",
    "resourceType": "style",
    "prefetch": true,
    "preload": true
  },
  "node_modules/remixicon/fonts/remixicon.eot": {
    "resourceType": "font",
    "mimeType": "font/eot",
    "file": "remixicon.BVJ9S1ev.eot",
    "src": "node_modules/remixicon/fonts/remixicon.eot"
  },
  "node_modules/remixicon/fonts/remixicon.svg": {
    "resourceType": "image",
    "prefetch": true,
    "mimeType": "image/svg+xml",
    "file": "remixicon.C2wQ2gtc.svg",
    "src": "node_modules/remixicon/fonts/remixicon.svg"
  },
  "node_modules/remixicon/fonts/remixicon.ttf": {
    "resourceType": "font",
    "mimeType": "font/ttf",
    "file": "remixicon.CfJD46dY.ttf",
    "src": "node_modules/remixicon/fonts/remixicon.ttf"
  },
  "node_modules/remixicon/fonts/remixicon.woff": {
    "resourceType": "font",
    "mimeType": "font/woff",
    "file": "remixicon.BBpe-Xu7.woff",
    "src": "node_modules/remixicon/fonts/remixicon.woff"
  },
  "node_modules/remixicon/fonts/remixicon.woff2": {
    "resourceType": "font",
    "mimeType": "font/woff2",
    "file": "remixicon.BVvFtaex.woff2",
    "src": "node_modules/remixicon/fonts/remixicon.woff2"
  },
  "pages/admin/dashboard.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Ba7WovqO.js",
    "name": "dashboard",
    "src": "pages/admin/dashboard.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/admin/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "B4_ZpmLG.js",
    "name": "index",
    "src": "pages/admin/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/admin/products/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "Di02uun2.js",
    "name": "index",
    "src": "pages/admin/products/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/admin/users/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DHsvaPjt.js",
    "name": "index",
    "src": "pages/admin/users/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_NzQZ86FH.js"
    ]
  },
  "pages/assistant-ia.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DeJudUNt.js",
    "name": "assistant-ia",
    "src": "pages/assistant-ia.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/auth/login.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "jMAXydJ6.js",
    "name": "login",
    "src": "pages/auth/login.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/auth/register.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "D7Qi8Ndn.js",
    "name": "register",
    "src": "pages/auth/register.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js"
    ]
  },
  "pages/community/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "DliqkDlJ.js",
    "name": "index",
    "src": "pages/community/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_DOggr6EX.js"
    ]
  },
  "pages/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "2RZGkuNd.js",
    "name": "index",
    "src": "pages/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_DOggr6EX.js"
    ],
    "css": [
      "index.B7RHwwhT.css"
    ]
  },
  "index.B7RHwwhT.css": {
    "file": "index.B7RHwwhT.css",
    "resourceType": "style",
    "prefetch": true,
    "preload": true
  },
  "pages/learning/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "CyUl7UqF.js",
    "name": "index",
    "src": "pages/learning/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_DOggr6EX.js"
    ]
  },
  "pages/marketplace/index.vue": {
    "resourceType": "script",
    "module": true,
    "prefetch": true,
    "preload": true,
    "file": "-0Z1E6te.js",
    "name": "index",
    "src": "pages/marketplace/index.vue",
    "isDynamicEntry": true,
    "imports": [
      "node_modules/nuxt/dist/app/entry.js",
      "_DOggr6EX.js"
    ]
  }
}