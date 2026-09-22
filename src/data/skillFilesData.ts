import { AgentSkill } from '../types';
import { SkillFileItem } from '../components/modules/agent_config/SkillFileExplorer';

/**
 * 30 subsidiary files in .json format matching the hierarchical structure
 */
export const DEFAULT_SUBSIDIARY_FILES: SkillFileItem[] = [
  // 13 files under data/stacks/ (.json)
  {
    name: 'data/stacks/astro.json',
    content: JSON.stringify(
      [
        { id: 1, framework: 'Astro', component: 'IslandArchitecture', template: 'ContentCollection', perf_score: 99 },
        { id: 2, framework: 'Astro', component: 'TailwindPlugin', template: 'StaticSiteGen', perf_score: 98 },
        { id: 3, framework: 'Astro', component: 'MarkdownEngine', template: 'MDXRender', perf_score: 96 }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/flutter.json',
    content: JSON.stringify(
      [
        { id: 1, widget: 'Scaffold', platform: 'CrossPlatform', responsiveness: 'LayoutBuilder', material_version: 'Material3' },
        { id: 2, widget: 'CustomScrollView', platform: 'MobileDesktop', responsiveness: 'SliverAppBar', material_version: 'Material3' },
        { id: 3, widget: 'StatefulWidget', platform: 'All', responsiveness: 'RiverpodBloc', material_version: 'Material3' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/html-tailwind.json',
    content: JSON.stringify(
      [
        { id: 1, utility: 'flex-col', theme_mode: 'responsive', breakpoint: 'md:flex-row', accessibility: 'aria-label' },
        { id: 2, utility: 'grid-cols-12', theme_mode: 'container', breakpoint: 'lg:grid-cols-4', accessibility: 'sr-only' },
        { id: 3, utility: 'rounded-2xl', theme_mode: 'surface', breakpoint: 'shadow-sm', accessibility: 'focus:ring-2' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/jetpack-compose.json',
    content: JSON.stringify(
      [
        { id: 1, composable: 'Surface', modifier: 'fillMaxSize', theme: 'MaterialTheme', version: 'Compose1.6' },
        { id: 2, composable: 'LazyColumn', modifier: 'padding16dp', theme: 'ShapesMedium', version: 'Compose1.6' },
        { id: 3, composable: 'TopAppBar', modifier: 'elevation4dp', theme: 'TypographyTitle', version: 'Compose1.6' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/nextjs.json',
    content: JSON.stringify(
      [
        { id: 1, pattern: 'AppRouter', rendering: 'ServerComponent', cache_strategy: 'force-cache', route_type: 'Dynamic' },
        { id: 2, pattern: 'ServerAction', rendering: 'ServerSide', cache_strategy: 'revalidatePath', route_type: 'POST' },
        { id: 3, pattern: 'EdgeMiddleware', rendering: 'EdgeRuntime', cache_strategy: 'stale-while-revalidate', route_type: 'Global' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/nuxt-ui.json',
    content: JSON.stringify(
      [
        { id: 1, component: 'UButton', theme_token: 'primary', variant: 'solid', headless: true },
        { id: 2, component: 'UModal', theme_token: 'overlay', variant: 'blur', headless: true },
        { id: 3, component: 'UTable', theme_token: 'striped', variant: 'bordered', headless: true }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/nuxtjs.json',
    content: JSON.stringify(
      [
        { id: 1, feature: 'AutoImports', mode: 'Universal', ssr_strategy: 'UniversalHydration', nitro_engine: 'NitroV2' },
        { id: 2, feature: 'PiniaStore', mode: 'State', ssr_strategy: 'SSRReactive', nitro_engine: 'NitroV2' },
        { id: 3, feature: 'ServerRoutes', mode: 'API', ssr_strategy: 'ServerMiddleware', nitro_engine: 'NitroV2' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/react-native.json',
    content: JSON.stringify(
      [
        { id: 1, component: 'View', gesture_handler: 'react-native-gesture', animation_lib: 'reanimated-v3', native_bridge: 'Fabric' },
        { id: 2, component: 'FlatList', gesture_handler: 'pull-to-refresh', animation_lib: 'layout-animation', native_bridge: 'Fabric' },
        { id: 3, component: 'Modal', gesture_handler: 'bottom-sheet', animation_lib: 'react-native-screens', native_bridge: 'TurboModules' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/react.json',
    content: JSON.stringify(
      [
        { id: 1, hook_pattern: 'useMemo_useCallback', concurrency: 'ConcurrentMode', bundler: 'Vite6', state_mgmt: 'Zustand' },
        { id: 2, hook_pattern: 'SuspenseStreaming', concurrency: 'ServerClient', bundler: 'Vite6', state_mgmt: 'TanStackQuery' },
        { id: 3, hook_pattern: 'ContextReducer', concurrency: 'SelectiveRerender', bundler: 'Vite6', state_mgmt: 'ReactContext' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/shadcn.json',
    content: JSON.stringify(
      [
        { id: 1, primitive: 'Dialog', radix_pkg: '@radix-ui/react-dialog', tailwind_plugin: 'tailwindcss-animate', animation: 'scale-in' },
        { id: 2, primitive: 'DropdownMenu', radix_pkg: '@radix-ui/react-dropdown-menu', tailwind_plugin: 'tailwindcss-animate', animation: 'fade-in' },
        { id: 3, primitive: 'Tabs', radix_pkg: '@radix-ui/react-tabs', tailwind_plugin: 'tailwindcss-animate', animation: 'slide-down' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/svelte.json',
    content: JSON.stringify(
      [
        { id: 1, runes: '$state', syntax: 'Svelte5', reactivity: 'FineGrained', compiler: 'SvelteCompiler' },
        { id: 2, runes: '$derived', syntax: 'Svelte5', reactivity: 'AutoTrack', compiler: 'SvelteCompiler' },
        { id: 3, runes: '$effect', syntax: 'Svelte5', reactivity: 'DOMSubscription', compiler: 'SvelteCompiler' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/swiftui.json',
    content: JSON.stringify(
      [
        { id: 1, view_type: 'VStack', property_wrapper: '@StateObject', platform: 'iOS_macOS', ios_target: 'iOS17' },
        { id: 2, view_type: 'NavigationStack', property_wrapper: '@Environment', platform: 'iOS_macOS', ios_target: 'iOS17' },
        { id: 3, view_type: 'List', property_wrapper: '@Binding', platform: 'iOS_macOS', ios_target: 'iOS17' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/stacks/vue.json',
    content: JSON.stringify(
      [
        { id: 1, composition_api: 'ref_reactive', reactivity: 'ProxyBased', template_syntax: 'v-bind_v-model', script_setup: true },
        { id: 2, composition_api: 'computed', reactivity: 'CachedGetter', template_syntax: 'v-for_v-if', script_setup: true },
        { id: 3, composition_api: 'watchEffect', reactivity: 'SideEffectRunner', template_syntax: 'custom-directives', script_setup: true }
      ],
      null,
      2
    ),
    isMain: false
  },

  // 17 files directly under data/ (.json)
  {
    name: 'data/charts.json',
    content: JSON.stringify(
      [
        { chart_type: 'BarChart', recommended_lib: 'recharts', aspect_ratio: '16:9', color_scheme: 'slate-emerald', tooltip_mode: 'single-item' },
        { chart_type: 'AreaChart', recommended_lib: 'recharts', aspect_ratio: '21:9', color_scheme: 'blue-gradient', tooltip_mode: 'crosshair' },
        { chart_type: 'PieChart', recommended_lib: 'recharts', aspect_ratio: '1:1', color_scheme: 'categorical-8', tooltip_mode: 'centered-label' },
        { chart_type: 'RadarChart', recommended_lib: 'd3', aspect_ratio: '1:1', color_scheme: 'warm-accent', tooltip_mode: 'multi-axis' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/colors.json',
    content: JSON.stringify(
      [
        { token_name: 'primary', hex_light: '#EA3A20', hex_dark: '#FF5738', wcag_ratio: '7.2:1', usage: 'brand-actions-buttons' },
        { token_name: 'surface_0', hex_light: '#FFFFFF', hex_dark: '#0F172A', wcag_ratio: '14.5:1', usage: 'base-card-background' },
        { token_name: 'surface_1', hex_light: '#F8FAFC', hex_dark: '#1E293B', wcag_ratio: '12.1:1', usage: 'subtle-panel-container' },
        { token_name: 'text_primary', hex_light: '#0F172A', hex_dark: '#F8FAFC', wcag_ratio: '15.2:1', usage: 'headings-body-text' },
        { token_name: 'text_secondary', hex_light: '#64748B', hex_dark: '#94A3B8', wcag_ratio: '5.4:1', usage: 'captions-metadata-labels' },
        { token_name: 'border_subtle', hex_light: '#E2E8F0', hex_dark: '#334155', wcag_ratio: '4.8:1', usage: 'card-dividers-separators' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/icons.json',
    content: JSON.stringify(
      [
        { icon_name: 'Calculator', library: 'lucide-react', stroke_width: 1.75, optical_size: '20px', category: 'tools' },
        { icon_name: 'Coins', library: 'lucide-react', stroke_width: 1.75, optical_size: '20px', category: 'finance' },
        { icon_name: 'ShieldCheck', library: 'lucide-react', stroke_width: 1.75, optical_size: '20px', category: 'security' },
        { icon_name: 'FileText', library: 'lucide-react', stroke_width: 1.75, optical_size: '20px', category: 'documents' },
        { icon_name: 'Ship', library: 'lucide-react', stroke_width: 1.75, optical_size: '20px', category: 'logistics' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/landing.json',
    content: JSON.stringify(
      [
        { section: 'hero', priority: 1, max_width: '1280px', spacing_y: '80px', cta_type: 'dual-action-primary-secondary' },
        { section: 'metrics', priority: 2, max_width: '1120px', spacing_y: '48px', cta_type: 'four-column-stat-grid' },
        { section: 'feature_bento', priority: 3, max_width: '1280px', spacing_y: '64px', cta_type: 'bento-irregular-cards' },
        { section: 'testimonials', priority: 4, max_width: '1024px', spacing_y: '48px', cta_type: 'infinite-marquee-carousel' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/products.json',
    content: JSON.stringify(
      [
        { category: 'CustomKitchenCabinet', material_standard: 'CARB_P2_MFC', fob_range_usd: '120-280', cbm_unit: 0.18, lead_time_days: 25 },
        { category: 'SolidWoodWardrobe', material_standard: 'FSC_Oak_Walnut', fob_range_usd: '350-750', cbm_unit: 0.45, lead_time_days: 35 },
        { category: 'LuxuryVanityUnit', material_standard: 'LaserEdge_HPL', fob_range_usd: '85-190', cbm_unit: 0.12, lead_time_days: 20 },
        { category: 'CommercialReceptionDesk', material_standard: 'Corian_Stainless', fob_range_usd: '600-1800', cbm_unit: 0.85, lead_time_days: 30 }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/react-performance.json',
    content: JSON.stringify(
      [
        { rule_code: 'PERF_01', target: 'useMemo', recommendation: 'Avoid memoizing trivial string concatenations', danger_level: 'low' },
        { rule_code: 'PERF_02', target: 'useEffect', recommendation: 'Never put non-stabilized objects in deps array', danger_level: 'critical' },
        { rule_code: 'PERF_03', target: 'ResizeObserver', recommendation: 'Debounce resize triggers on heavy charts', danger_level: 'medium' },
        { rule_code: 'PERF_04', target: 'VirtualScroll', recommendation: 'Enable virtualized list for records > 100', danger_level: 'high' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/typography.json',
    content: JSON.stringify(
      [
        { font_role: 'display', font_family: 'Plus Jakarta Sans', fallback: 'sans-serif', scale_ratio: 1.25, line_height: 1.2 },
        { font_role: 'heading', font_family: 'Plus Jakarta Sans', fallback: 'sans-serif', scale_ratio: 1.2, line_height: 1.3 },
        { font_role: 'body', font_family: 'Inter', fallback: 'sans-serif', scale_ratio: 1.0, line_height: 1.6 },
        { font_role: 'code', font_family: 'JetBrains Mono', fallback: 'monospace', scale_ratio: 0.9, line_height: 1.5 }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/spacing.json',
    content: JSON.stringify(
      [
        { step: 'space_1', rem: '0.25rem', px: '4px', recommended_use: 'badge_padding_x' },
        { step: 'space_2', rem: '0.5rem', px: '8px', recommended_use: 'icon_gap_text' },
        { step: 'space_3', rem: '0.75rem', px: '12px', recommended_use: 'button_padding_y' },
        { step: 'space_4', rem: '1.0rem', px: '16px', recommended_use: 'card_inner_gap' },
        { step: 'space_6', rem: '1.5rem', px: '24px', recommended_use: 'container_outer_padding' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/motion.json',
    content: JSON.stringify(
      [
        { animation_type: 'fade_in', duration_ms: 200, ease_curve: 'ease-out', property: 'opacity' },
        { animation_type: 'slide_up', duration_ms: 250, ease_curve: 'cubic-bezier(0.16, 1, 0.3, 1)', property: 'transform_opacity' },
        { animation_type: 'scale_bounce', duration_ms: 150, ease_curve: 'ease-in-out', property: 'transform_scale' },
        { animation_type: 'drawer_enter', duration_ms: 300, ease_curve: 'cubic-bezier(0.32, 0.72, 0, 1)', property: 'translateX' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/forms.json',
    content: JSON.stringify(
      [
        { input_type: 'text_input', height: '40px', border_radius: '12px', focus_ring: 'ring-2 ring-primary/20', validation_trigger: 'onBlur' },
        { input_type: 'select_dropdown', height: '40px', border_radius: '12px', focus_ring: 'ring-2 ring-primary/20', validation_trigger: 'onChange' },
        { input_type: 'textarea', height: '100px', border_radius: '14px', focus_ring: 'ring-2 ring-primary/20', validation_trigger: 'onBlur' },
        { input_type: 'switch_toggle', height: '24px', border_radius: '999px', focus_ring: 'ring-2 ring-primary/20', validation_trigger: 'onClick' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/tables.json',
    content: JSON.stringify(
      [
        { table_style: 'enterprise_clean', header_bg: '#F8FAFC', row_hover: '#F1F5F9', border_style: 'border-slate-200', pagination_mode: 'client_server_hybrid' },
        { table_style: 'compact_dense', header_bg: '#F1F5F9', row_hover: '#E2E8F0', border_style: 'border-slate-300', pagination_mode: 'infinite_scroll' },
        { table_style: 'financial_grid', header_bg: '#FFFFFF', row_hover: '#F8FAFC', border_style: 'border-slate-100', pagination_mode: 'fixed_page_size' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/modals.json',
    content: JSON.stringify(
      [
        { modal_type: 'confirmation', max_width: '440px', backdrop: 'bg-black/40 backdrop-blur-xs', closing_mechanism: 'click_outside_esc', animation: 'scale_in' },
        { modal_type: 'form_drawer', max_width: '640px', backdrop: 'bg-black/30', closing_mechanism: 'drawer_handle_esc', animation: 'slide_right' },
        { modal_type: 'full_editor', max_width: '1100px', backdrop: 'bg-black/50', closing_mechanism: 'header_close_btn', animation: 'fade_zoom' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/navigation.json',
    content: JSON.stringify(
      [
        { nav_pattern: 'primary_sidebar', dock_position: 'left', collapse_width: '64px', expand_width: '240px', badge_style: 'red_pill_count' },
        { nav_pattern: 'top_breadcrumb', dock_position: 'top', collapse_width: 'full', expand_width: 'full', badge_style: 'chevron_separator' },
        { nav_pattern: 'multi_tab_bar', dock_position: 'sub_top', collapse_width: 'full', expand_width: 'full', badge_style: 'active_border_bottom' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/responsive.json',
    content: JSON.stringify(
      [
        { breakpoint: 'sm', min_width: '640px', sidebar_behavior: 'hidden_bottom_nav', grid_columns: '1_col', touch_target: '48px' },
        { breakpoint: 'md', min_width: '768px', sidebar_behavior: 'collapsed_dock', grid_columns: '2_col', touch_target: '44px' },
        { breakpoint: 'lg', min_width: '1024px', sidebar_behavior: 'expanded_sidebar', grid_columns: '3_col', touch_target: '40px' },
        { breakpoint: 'xl', min_width: '1280px', sidebar_behavior: 'expanded_sidebar', grid_columns: '4_col', touch_target: '36px' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/accessibility.json',
    content: JSON.stringify(
      [
        { guideline_id: 'A11Y_01', wcag_level: 'AA', rule: 'Color contrast ratio >= 4.5:1 for body', test_method: 'AutomatedLighthouse' },
        { guideline_id: 'A11Y_02', wcag_level: 'AA', rule: 'Interactive buttons have aria-label', test_method: 'DOMInspection' },
        { guideline_id: 'A11Y_03', wcag_level: 'AA', rule: 'Keyboard navigation TabIndex focus visible', test_method: 'KeyboardTabTrap' },
        { guideline_id: 'A11Y_04', wcag_level: 'AAA', rule: 'Screen reader headings follow H1-H3 hierarchy', test_method: 'VoiceOverAria' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/dark-mode.json',
    content: JSON.stringify(
      [
        { token: 'canvas', light_value: '#FFFFFF', dark_value: '#0B0F17', contrast_step: 'step_0' },
        { token: 'elevation_1', light_value: '#F8FAFC', dark_value: '#131B2E', contrast_step: 'step_1' },
        { token: 'elevation_2', light_value: '#F1F5F9', dark_value: '#1E293B', contrast_step: 'step_2' },
        { token: 'border_line', light_value: '#E2E8F0', dark_value: '#2A374A', contrast_step: 'step_divider' }
      ],
      null,
      2
    ),
    isMain: false
  },
  {
    name: 'data/tokens.json',
    content: JSON.stringify(
      [
        { category: 'radius_sm', variable: '--radius-sm', value_rem: '0.375rem', value_px: '6px' },
        { category: 'radius_md', variable: '--radius-md', value_rem: '0.5rem', value_px: '8px' },
        { category: 'radius_lg', variable: '--radius-lg', value_rem: '0.75rem', value_px: '12px' },
        { category: 'radius_xl', variable: '--radius-xl', value_rem: '1.0rem', value_px: '16px' },
        { category: 'radius_2xl', variable: '--radius-2xl', value_rem: '1.5rem', value_px: '24px' }
      ],
      null,
      2
    ),
    isMain: false
  }
];

/**
 * Generate standard SKILL.md markdown content matching the user's screenshot
 */
export function generateSkillMarkdown(skill: AgentSkill): string {
  return `# ${skill.code || 'ui-ux-pro-max'}

${skill.description || 'Comprehensive design guide for web and mobile applications. Contains 67 styles, 96 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 13 technology stacks. Searchable database with priority-based recommendations.'}

## Prerequisites

Check if Python is installed:

\`\`\`bash
python3 --version || python --version
\`\`\`

If Python is not installed, install it based on user's OS:

**macOS:**

\`\`\`bash
brew install python3
\`\`\`

**Ubuntu/Debian:**

\`\`\`bash
sudo apt update && sudo apt install python3
\`\`\`

**Windows:**

\`\`\`bash
winget install Python.Python.3.12
\`\`\`

## How to Use This Skill

When user requests UI/UX work (design, build, create, implement, review, fix, improve), follow this workflow:

### Step 1: Analyze User Requirements
- Detect target stack (e.g., React, Vue, Next.js, Flutter, SwiftUI)
- Identify industry tone (e.g., Modern B2B SaaS, Minimalist E-Commerce, Enterprise Dashboard)
- Match responsive layout standards (Desktop first, touch target >= 44px)

### Step 2: Query Embedded Stacks & Rules
- Load JSON configuration references from \`data/stacks/\` and \`data/\`
- Prioritize high-contrast accessible color tokens from \`data/colors.json\`
- Apply performance constraints from \`data/react-performance.json\`

### Step 3: Triggering & Integration
- **触发机制**: ${skill.triggerType || '自动语义唤起'}
- **唤起关键词**: ${(skill.triggerKeywords || ['外贸', '智能体', '算法']).join(', ')}
- **当前版本**: ${skill.version || 'v2.4.0'}
- **参数规格**:
\`\`\`json
${JSON.stringify(skill.parameters || [], null, 2)}
\`\`\`

### Step 4: Code Output & Quality Assurance
- Use semantic HTML tags with unique \`id\` attributes
- Ensure WCAG AA color contrast ratio (> 4.5:1)
- Verify mobile responsiveness and animation smoothness
`;
}

/**
 * Helper to ensure a skill has both main SKILL.md and all 30 hierarchical subsidiary files
 */
export function getCompleteSkillFiles(skill: AgentSkill): SkillFileItem[] {
  // If skill already has updated .json files, use them
  if (skill.files && skill.files.length >= 10 && skill.files.some(f => f.name.endsWith('.json'))) {
    return skill.files;
  }

  const mainMd: SkillFileItem = {
    name: 'SKILL.md',
    content: generateSkillMarkdown(skill),
    isMain: true
  };

  return [mainMd, ...DEFAULT_SUBSIDIARY_FILES];
}
